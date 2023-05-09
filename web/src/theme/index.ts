import { createProxyObj } from 'yayaluoya-tool/dist/obj/createProxyObj';

/**
 * 主题内容
 */
const theme: Record<string, string> = createProxyObj(
    {},
    {
        set: setThemeB,
    },
);

/** 是否更改 */
let ifUpdate = false;
/** 设置主题  */
function setThemeB() {
    ifUpdate = true;
    Promise.resolve().then(() => {
        ifUpdate = false;
        for (let i in theme) {
            if (theme[i]) {
                document.body.style.setProperty(`--${i}`, theme[i]);
            } else {
                document.body.style.removeProperty(`--${i}`);
            }
        }
    });
}

setThemeB();

/** 设置主题 */
export function setTheme(type: 'dark' | 'bright') {
    let op: any = {};
    switch (type) {
        case 'dark':
            op = {
                backgroundColor: '#22272e',
                color: '#adbac7',
                borderColor: '#373e47',
                contentBackgroundColor: '#2d333b',
                'el-fill-color-blank': '#2d333b',
                'el-bg-color': '#2d333b',
                'el-border-color': '#373e47',
                'el-border-color-light': '#373e47',
                'el-border-color-lighter': '#373e47',
                'el-fill-color-light': '#22272e',
            };
            break;
        case 'bright':
            op = {
                backgroundColor: '#fbfbfb',
                color: '#2f495e',
                borderColor: '#f1f1f1',
                contentBackgroundColor: 'white',
                'el-fill-color-blank': '#ffffff',
                'el-bg-color': '#ffffff',
                'el-border-color': '#dcdfe6',
                'el-border-color-light': '#e4e7ed',
                'el-border-color-lighter': '#ebeef5',
                'el-fill-color-light': '#f5f7fa',
            };
            break;
    }
    //
    for (let i in op) {
        theme[i] = op[i];
    }
}
