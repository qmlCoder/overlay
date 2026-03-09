use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Mole {
    pub idxs: Vec<usize>,
    pub xyzs: Vec<[f64; 3]>,
}
