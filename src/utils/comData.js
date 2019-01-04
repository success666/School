export const JURISDICTION = [
    { id: 1, name: '教育部' },
    { id: 2, name: '省级' },
    { id: 3, name: '市级' },
    { id: 4, name: '区级' }
];

export const TESTITEMLEVEL1 = [
    { id: 0, label: "合格" },
    { id: 5, label: "优良" },
    { id: 1, label: "优秀" },
    { id: 2, label: "良好" },
    { id: 3, label: "及格" },
    { id: 4, label: "不及格" }
];
export const TESTITEMLEVEL = [
    { id: 0, label: "合格" },
    { id: 1, label: "优秀" },
    { id: 2, label: "良好" },
    { id: 3, label: "及格" },
    { id: 4, label: "不及格" }
];
export const BODYMASSINDEXLEVEL = [
    { id: 5, label: "正常" },
    { id: 7, label: "低体重" },
    { id: 8, label: "超重" },
    { id: 9, label: "肥胖" }
];
export const FIFTYMETERRUNLEVEL = [
    { id: 0, label: "合格" },
    { id: 1, label: "优秀" },
    { id: 2, label: "良好" },
    { id: 3, label: "及格" },
    { id: 4, label: "不及格" }
];
export const EYEEYES = [
    { id: 10, label: "视力正常" },
    { id: 11, label: "轻度近视" },
    { id: 12, label: "中度近视" },
    { id: 13, label: "重度近视" }
]
export const TORSOTILT = [
    { id: 14, label: "阴性" },
    { id: 15, label: "阳性" },
    { id: 16, label: "强阳性" }
]

export const HEALTHCHART = {
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: "{b}<br />{a}:{c}%"
    },
    legend: {
        data: []
    },
    "xAxis": {
        "data": [],
        "offset": 50,
        "nameGap": 100,
        "axisLabel": {
            "interval": 0
        }
    },
    "yAxis": {
        "name": "合格率",
        min: 0,
        max: 100,
        "axisLabel": {
            "show": true,
            "interval": "auto",
            "formatter": "{value} %"
        }
    },
    "series": []
};

export const HEALTHSER = {
    "name": "",
    "type": "bar",
    "data": [],
    "barWidth": 20,
    "barGap": '30%', // Make series be overlap
    "label": {
        "normal": {
            "show": true,
            "position": "bottom",
            "formatter": "{name|{a}}",
            "rotate": 30,
            "align": "center",
            "verticalAlign": "top",
            "distance": 22,
            "fontSize": 16,
            "rich": {
                "name": {
                    "textBorderColor": "#fff"
                }
            }
        }
    }
}