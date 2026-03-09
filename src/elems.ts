type Element = {
  atomic: number;
  symbol: string;
  radius: number;
  color: string;
};

export class Elements {
  s2e: { [key: string]: Element };
  i2e: { [key: number]: Element };
  data: [number, string, number, string][];
  constructor() {
    this.data = [
      [-1, "Bq", 30, "#B21ED3"], // 原子索引，原子符号，原子半径，原子颜色
      [0, "X", 30, "#B21ED3"], // 原子索引，原子符号，原子半径，原子颜色
      [1, "H", 32, "#CCCCCC"],
      [2, "He", 46, "#D8FFFF"],
      [3, "Li", 133, "#CC7CFF"],
      [4, "Be", 102, "#CCFF00"],
      [5, "B", 85, "#FFB5B5"],
      [6, "C", 75, "#8E8E8E"],
      [7, "N", 71, "#1919E5"],
      [8, "O", 63, "#E50000"],
      [9, "F", 64, "#B2FFFF"],
      [10, "Ne", 67, "#AFE2F4"],
      [11, "Na", 155, "#AA5BF2"],
      [12, "Mg", 139, "#B2CC00"],
      [13, "Al", 126, "#D1A5A5"],
      [14, "Si", 116, "#7F9999"],
      [15, "P", 111, "#FF7F00"],
      [16, "S", 103, "#FFC628"],
      [17, "Cl", 99, "#19EF19"],
      [18, "Ar", 96, "#7FD1E2"],
      [19, "K", 196, "#8E3FD3"],
      [20, "Ca", 171, "#999900"],
      [21, "Sc", 148, "#E5E5E2"],
      [22, "Ti", 136, "#BFC1C6"],
      [23, "V", 134, "#A5A5AA"],
      [24, "Cr", 122, "#8999C6"],
      [25, "Mn", 119, "#9B7AC6"],
      [26, "Fe", 116, "#7F7AC6"],
      [27, "Co", 111, "#5B6DFF"],
      [28, "Ni", 110, "#5B7AC1"],
      [29, "Cu", 112, "#FF7A60"],
      [30, "Zn", 118, "#7C7FAF"],
      [31, "Ga", 124, "#C18E8E"],
      [32, "Ge", 121, "#668E8E"],
      [33, "As", 121, "#BC7FE2"],
      [34, "Se", 116, "#FFA000"],
      [35, "Br", 114, "#A52121"],
      [36, "Kr", 117, "#5BBAD1"],
      [37, "Rb", 210, "#702DAF"],
      [38, "Sr", 185, "#7F6600"],
      [39, "Y", 163, "#93FCFF"],
      [40, "Zr", 154, "#93E0E0"],
      [41, "Nb", 147, "#72C1C9"],
      [42, "Mo", 138, "#54B5B5"],
      [43, "Tc", 128, "#3A9EA8"],
      [44, "Ru", 125, "#238E96"],
      [45, "Rh", 125, "#0A7C8C"],
      [46, "Pd", 120, "#006884"],
      [47, "Ag", 128, "#99C6FF"],
      [48, "Cd", 136, "#FFD88E"],
      [49, "In", 142, "#A57572"],
      [50, "Sn", 140, "#667F7F"],
      [51, "Sb", 140, "#9E63B5"],
      [52, "Te", 140, "#D37A00"],
      [53, "I", 140, "#930093"],
      [54, "Xe", 140, "#429EAF"],
      [55, "Cs", 140, "#56168E"],
      [56, "Ba", 140, "#663300"],
      [57, "La", 140, "#70DDFF"],
      [58, "Ce", 140, "#FFFFC6"],
      [59, "Pr", 140, "#D8FFC6"],
      [60, "Nd", 140, "#C6FFC6"],
      [61, "Pm", 140, "#A3FFC6"],
      [62, "Sm", 140, "#8EFFC6"],
      [63, "Eu", 140, "#60FFC6"],
      [64, "Gd", 140, "#44FFC6"],
      [65, "Tb", 140, "#30FFC6"],
      [66, "Dy", 140, "#1EFFB5"],
      [67, "Ho", 140, "#00FFB5"],
      [68, "Er", 140, "#00E575"],
      [69, "Tm", 140, "#00D351"],
      [70, "Yb", 140, "#00BF38"],
      [71, "Lu", 140, "#00AA23"],
      [72, "Hf", 140, "#4CC1FF"],
      [73, "Ta", 140, "#4CA5FF"],
      [74, "W", 140, "#2693D6"],
      [75, "Re", 140, "#267CAA"],
      [76, "Os", 140, "#266696"],
      [77, "Ir", 140, "#165487"],
      [78, "Pt", 140, "#165B8E"],
      [79, "Au", 140, "#FFD123"],
      [80, "Hg", 140, "#B5B5C1"],
      [81, "Ti", 140, "#A5544C"],
      [82, "Pb", 140, "#565960"],
      [83, "Bi", 140, "#9E4FB5"],
      [84, "Po", 140, "#AA5B00"],
      [85, "At", 140, "#754F44"],
      [86, "Rn", 140, "#428296"],
      [87, "Fr", 140, "#420066"],
      [88, "Ra", 140, "#4C1900"],
      [89, "Ac", 140, "#70AAF9"],
      [90, "Th", 140, "#00BAFF"],
      [91, "Pa", 140, "#00A0FF"],
      [92, "U", 140, "#008EFF"],
      [93, "Np", 140, "#007FF2"],
      [94, "Pu", 140, "#006BF2"],
      [95, "Am", 140, "#545BF2"],
      [96, "Cm", 140, "#775BE2"],
      [97, "Bk", 140, "#895EE2"],
      [98, "Cf", 140, "#A035D3"],
      [99, "Es", 140, "#A82BC6"],
      [100, "Fm", 140, "#B21EBA"],
      [101, "Md", 140, "#B20CA5"],
      [102, "No", 140, "#BC0C87"],
      [103, "Lr", 140, "#C60066"],
      [104, "Rf", 140, "#FF7F7F"],
      [105, "Db", 140, "#E56666"],
      [106, "Sg", 140, "#CC4C4C"],
      [107, "Bh", 140, "#B23333"],
      [108, "Hs", 140, "#991919"],
      [109, "Mt", 140, "#8C0000"],
      [110, "Ds", 140, "#7F0000"],
      [111, "Rg", 140, "#720000"],
    ];
    for (let i = 0; i < this.data.length; i++) {
      const radius = this.data[i][2];
      this.data[i][2] = radius / 100;
    }
    this.i2e = {};
    this.s2e = {};
  }

  get_byI(atomic: number): Element {
    if (!Object.keys(this.i2e).includes(String(atomic))) {
      for (let i = 0; i < this.data.length; i++) {
        const [atomic_, symbol, radius, color] = this.data[i];
        if (atomic_ == atomic) {
          this.i2e[atomic] = { atomic, symbol, radius, color };
          break;
        }
      }
    }
    return this.i2e[atomic];
  }

  /**
   * 根据元素符号获取原子类型
   */
  get_byS(symbol: string): Element {
    if (!Object.keys(this.s2e).includes(symbol)) {
      for (let i = 0; i < this.data.length; i++) {
        const [atomic, symbol_, radius, color] = this.data[i];
        if (symbol_ == symbol) {
          this.s2e[symbol] = { atomic, symbol, radius, color };
          break;
        }
      }
    }
    return this.s2e[symbol];
  }
}

export const elements = new Elements();
