use regex::Regex;
use std::fs::File;
use std::io::{BufRead, BufReader};

pub const BOHR: f64 = 0.52917721067;

pub fn read_lines(path: &str) -> Vec<String> {
    let file = File::open(path).expect(format!("无法打开文件{}", path).as_ref());
    let read = BufReader::new(file);
    let mut texts = Vec::new();
    for line in read.lines() {
        let line = line.expect("line read error");
        texts.push(line);
    }
    texts
}

#[tauri::command]
pub async fn read_gjf(path: &str) -> Result<(Vec<String>, Vec<[f64; 3]>), String> {
    let lines = read_lines(path);
    let mut syms = vec![];
    let mut xyzs = vec![];
    let s1 = Regex::new(r" ([A-Za-z\d]+) +(-?\d+.\d+) +(-?\d+.\d+) +(-?\d+.\d+)")
        .expect("正则表达式生成失败");
    for line in lines.iter() {
        if s1.is_match(line) {
            let caps = s1.captures(line).expect("捕获失败");
            let sym = caps[1].to_string();
            let x = caps[2].parse::<f64>().expect("解析浮点数失败");
            let y = caps[3].parse::<f64>().expect("解析浮点数失败");
            let z = caps[4].parse::<f64>().expect("解析浮点数失败");
            syms.push(sym);
            xyzs.push([x, y, z]);
        }
    }
    Ok((syms, xyzs))
}
