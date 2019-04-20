/**
 * 设置相同行的标记
 */
export function setSameRowSign() {
    this.sameRowItems = [];
    for (var i = 0; i < this.items.length; i++) {
        if (i === 0) {
            this.sameRowItems.push(1);
            this.pos = 0
        } else {
            if (this.items[i].sellerName === this.items[i - 1].sellerName) {
                this.sameRowItems[this.pos] += 1;
                this.sameRowItems.push(0)
            } else {
                // 不相等push 1
                this.sameRowItems.push(1);
                this.pos = i
            }
        }
    }
}

/**
 * 合并同标记相同行为一行
 */
export function mergeSameRow({row, column, rowIndex, columnIndex}) {
    if (this.sameRowItems && columnIndex === 0) {
        const _row = this.sameRowItems[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col
        }
    }
}

/**
 * 深度递归清空对象
 */
export function deepClearObject(form) {
    for (let item in form) {
        if (_.isArray(form[item])) {
            form[item] = []
        } else if (_.isObject(form[item])) {
            deepClearObject(form[item])
        } else if(!_.isBoolean(form[item])) {
            form[item] = ''
        }
    }
}

