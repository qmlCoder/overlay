#![allow(non_snake_case)]

use std::f64;

use crate::types;
// 获取绕x轴的旋转矩阵
fn get_MatRx(ang: f64) -> [[f64; 3]; 3] {
    let mat = [
        [1.0, 0.0, 0.0],
        [0.0, ang.cos(), -ang.sin()],
        [0.0, ang.sin(), ang.cos()],
    ];
    mat
}

fn get_MatRy(ang: f64) -> [[f64; 3]; 3] {
    let mat = [
        [ang.cos(), 0.0, ang.sin()],
        [0.0, 1.0, 0.0],
        [-ang.sin(), 0.0, ang.cos()],
    ];
    mat
}

fn get_MatRz(ang: f64) -> [[f64; 3]; 3] {
    let mat = [
        [ang.cos(), -ang.sin(), 0.0],
        [ang.sin(), ang.cos(), 0.0],
        [0.0, 0.0, 1.0],
    ];
    mat
}

// 矩阵乘列向量
fn mat_mul_vec(mat: [[f64; 3]; 3], vec: [f64; 3]) -> [f64; 3] {
    let mut result = [0.0; 3];
    for i in 0..3 {
        for j in 0..3 {
            result[i] += mat[i][j] * vec[j];
        }
    }
    result
}

// 获取旋转后的坐标
fn rotat(dir: &str, ang: f64, xyzs: &Vec<[f64; 3]>) -> Vec<[f64; 3]> {
    let mut xyzs_rotat = xyzs.clone();
    let mat = match dir {
        "x" => get_MatRx(ang),
        "y" => get_MatRy(ang),
        "z" => get_MatRz(ang),
        _ => {
            panic!("旋转轴只能是x、y或z");
        }
    };
    for i in 0..xyzs.len() {
        xyzs_rotat[i] = mat_mul_vec(mat, xyzs[i]);
    }
    xyzs_rotat
}

// 获取平移后的坐标
fn shift(dir: &str, val: f64, xyzs: &Vec<[f64; 3]>) -> Vec<[f64; 3]> {
    let mut xyzs_shift = xyzs.clone();
    for i in 0..xyzs.len() {
        match dir {
            "x" => xyzs_shift[i][0] += val,
            "y" => xyzs_shift[i][1] += val,
            "z" => xyzs_shift[i][2] += val,
            _ => {
                panic!("平移轴只能是x、y或z");
            }
        }
    }
    xyzs_shift
}

// 计算两组坐标的均方根偏差
fn mesd(
    xyzs1: &Vec<[f64; 3]>,
    xyzs2: &Vec<[f64; 3]>,
    idxs1: &Vec<usize>,
    idxs2: &Vec<usize>,
) -> f64 {
    let n = idxs1.len();

    let mut sum = 0.0;
    for i in 0..n {
        let idx1 = idxs1[i];
        let idx2 = idxs2[i];
        let dx = xyzs1[idx1][0] - xyzs2[idx2][0];
        let dy = xyzs1[idx1][1] - xyzs2[idx2][1];
        let dz = xyzs1[idx1][2] - xyzs2[idx2][2];
        let dist = (dx * dx + dy * dy + dz * dz).sqrt();
        sum += dist
    }
    let mse = sum / n as f64;
    mse
}

// 旋转或平移第二组坐标使两者的差距最小
#[tauri::command]
pub async fn align(mole1: types::Mole, mole2: types::Mole) -> Result<(Vec<[f64; 3]>, f64), String> {
    let dirs = ["x", "y", "z"];
    let angs = [-1.0, 1.0];
    let vals = [-2.0, 2.0];
    let mut step = 0.1;
    let xyzs1 = mole1.xyzs;
    let xyzs2 = mole2.xyzs;
    let idxs1 = mole1.idxs;
    let idxs2 = mole2.idxs;
    let mut min_err = mesd(&xyzs1, &xyzs2, &idxs1, &idxs2);
    let mut xyzs_opt = xyzs2.clone();
    for i in 0..300 {
        let mut new_err = min_err;
        for dir in dirs.iter() {
            for ang in angs.iter() {
                let xyzs_rotat = rotat(*dir, *ang * step, &xyzs_opt);
                let err = mesd(&xyzs1, &xyzs_rotat, &idxs1, &idxs2);
                // println!("旋转误差:{:>10.4}", err);
                if err < new_err {
                    new_err = err;
                    xyzs_opt = xyzs_rotat;
                }
            }
            for val in vals.iter() {
                let xyzs_shift = shift(*dir, *val * step, &xyzs_opt);
                let err = mesd(&xyzs1, &xyzs_shift, &idxs1, &idxs2);
                // println!("平移误差:{:>10.4}", err);
                if err < new_err {
                    new_err = err;
                    xyzs_opt = xyzs_shift;
                }
            }
        }
        if (min_err - new_err).abs() < 1e-10 {
            if step < 1e-8 {
                min_err = new_err;
                break;
            } else {
                step *= 0.5;
            }
        }

        println!(
            "error update {:>3}:{:>14.8}->{:>14.8}|{:>14.8}",
            i, min_err, new_err, step
        );
        min_err = new_err;
    }
    println!("meds = {:>14.8}", min_err);

    Ok((xyzs_opt, min_err))
}
