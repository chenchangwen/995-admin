/**
 * 页面初始化
 * @param options vue 实例参数
 * @param api 如果有,则覆盖window.curd
 */
window.pageInit = function pageInit(options, api) {
    api = window.curd || api;
    let apiPrefix = options.data.apiPrefix || '';
    let page = {
        data() {
            let defaults = {
                //表单 -> 当前dialog
                //新增,更新时实际操作的对象,所以缓存1层
                form: {},
                //更新,删除时的对象id键
                idKey: 'id',
                items: null,
                itemLoading: true,
                total: null,
                query: {
                    page: 0,
                    size: 10
                },
                dialogFormVisible: false,
                dialogStatus: '',
                dialogButtonLoading: false,
                dialogButtonDisabled: false,
                textMap: {
                    update: '编辑',
                    create: '新增'
                },
                //api地址前缀
                apiPrefix: '',
                apiQueryListName: '',
                //日期范围控制,需有form.beginTime,form.endTime, 如果有多个时间,需要另外定义
                beginTimeOptions: {
                    disabledDate: (time) => {
                        if (this.form.endTime) {
                            return time.getTime() > this.form.endTime;
                        }
                        else {
                            return time.getTime() < this.form.endTime;
                        }
                    }
                },
                endTimeOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < this.form.beginTime;
                    }
                },
            };
            return _.assign({}, defaults, options.data || '');
        },
        created() {
            this.getList();
        }
    };

    let pageData = page.data();

    let methods = {
        handleFilter() {
            this.query.page = 0;
            this.getList();
        },
        handleCreate(item) {
            this.dialogStatus = 'create';
            this.setItem(item);
            this.resetForm();
        },
        handleUpdate(row, item) {
            this.dialogStatus = 'update';
            this.setItem(item);
            this.row = _.cloneDeep(row);
            this.setDialogItem(this.row);
            this.resetForm();
        },
        createData() {
            this.$refs[this.item.formName].validate((valid) => {
                if (valid) {
                    delete this.form.id;
                    api.queryAdd(this.form, pageData).then((response) => {
                        this.items.splice(0, 1, response.data);
                        this.total = this.total + 1;
                        this.dialogFormVisible = false;
                        this.$notify({
                            title: '成功',
                            message: '创建成功',
                            type: 'success',
                            duration: 2000
                        });
                    })
                }
            })
        },
        editData() {
            this.$refs[this.item.formName].validate((valid) => {
                if (valid) {
                    this.dialogButtonLoading = true;
                    this.dialogButtonDisabled = true;
                    api.queryEdit(this.form, pageData).then(() => {
                        for (const v of this.items) {
                            if (v[this.idKey || 'id'] === this.form.id) {
                                const index = this.items.indexOf(v);
                                //关闭编辑窗口之后
                                if (typeof this.afterCloseDialog === 'function') {
                                    this.afterCloseDialog(this.row);
                                }
                                else {
                                    this.row = _.assignIn(this.row, this.form);
                                }
                                this.items.splice(index, 1, this.row);
                                break
                            }
                        }
                        this.dialogFormVisible = false;
                        this.$notify({
                            title: '成功',
                            message: '更新成功',
                            type: 'success',
                            duration: 2000
                        })
                    })
                }
            })
        },
        handleDelete(row) {
            this.$confirm('确定删除?', '提示', {type: 'warning'})
                .then(_ => {
                    let that = this;
                    let query = {
                        id: row[that.idKey] || ''
                    };
                    api.queryRemove(query, pageData).then((response) => {
                        if (response.data.success) {
                            this.getList();
                        }
                    });
                })
                .catch(_ => {
                });
        },
        resetForm() {
            if (this.dialogStatus === 'create') {
                Object.keys(this.form).forEach(item => {
                    this.form[item] = '';
                });
            }
            this.dialogFormVisible = true;
            this.dialogButtonLoading = false;
            this.dialogButtonDisabled = false;
            this.clearValidate();
        },
        getList() {
            this.itemLoading = true;
            let that = this;
            api.queryList(this.query, pageData).then(response => {
                this.items = response.data;
                this.itemLoading = false;
                api.queryCount({keyword: that.query.keyword}, pageData).then(response => {
                    that.total = response.data;
                })
            });
        },
        /**
         * 设置窗口对象
         */
        setDialogItem(row) {
            for (let item in this.form) {
                this.form[item] = row[item] || '';
            }
            if (!this.form['id']) {
                this.form['id'] = row['id'] || '';
            }
            //打开编辑窗口之前
            if (typeof this.beforeOpenDialog === 'function') {
                this.beforeOpenDialog(row);
            }
        },
        /**
         * 设置Item
         */
        setItem(item) {
            if (item) {
                this.item = item;
            }
            if (item && item.form) {
                this.form = item.form;
            }
        },
        /**
         * 清除验证
         */
        clearValidate() {
            this.$nextTick(() => {
                this.$refs[this.item.formName].clearValidate()
            });
        }
    };

    page.methods = _.assign({}, methods, options.methods || '');
    page.components = _.assign({}, options.components || '');
    return page;
};
