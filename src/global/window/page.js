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
            return Object.assign({}, defaults, options.data || '');
        },
        created() {
            this.getList();
        }
    };

    let methods = {
        handleFilter() {
            this.query.page = 0;
            this.getList();
        },
        handleCreate() {
            this.resetForm('create');
            let that = this;
            this.$nextTick(() => {
                that.$refs['dataForm'].clearValidate()
            })
        },
        createData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    delete this.form.id;
                    api.add(this.form, apiPrefix).then((response) => {
                        this.items.unshift(response.data.model);
                        this.total = this.items.length;
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
        handleUpdate(row) {
            this.row = _.cloneDeep(row);
            this.setRow(this.row);
            this.resetForm('update');
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            });
        },
        editData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.dialogButtonLoading = true;
                    this.dialogButtonDisabled = true;
                    api.edit(this.form, apiPrefix).then(() => {
                        for (const v of this.items) {
                            if (v[this.idKey || 'id'] === this.form.id) {
                                const index = this.items.indexOf(v);
                                //关闭编辑窗口之后
                                if (typeof this.afterCloseDialog === 'function') {
                                    this.afterCloseDialog(this.row);
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
                    api.remove(query, apiPrefix).then((response) => {
                        if (response.data.success) {
                            this.getList();
                        }
                    });
                })
                .catch(_ => {
                });
        },
        resetForm(status) {
            if (status === 'create') {
                Object.keys(this.form).forEach(item => {
                    this.form[item] = '';
                });
                if (this[this.dateName]) {
                    this[this.dateName] = '';
                }
            }
            this.dialogStatus = status;
            this.dialogFormVisible = true;
            this.dialogButtonLoading = false;
            this.dialogButtonDisabled = false;
        },
        getList() {
            this.itemLoading = true;
            let that = this;
            api.queryList(this.query, apiPrefix).then(response => {
                this.items = response.data;
                this.itemLoading = false;
                api.count({keyword: that.query.keyword}, apiPrefix).then(response => {
                    that.total = response.data;
                })
            });
        },
        /**
         * 设置row
         */
        setRow(row) {
            //打开编辑窗口之前
            if (typeof this.beforeOpenDialog === 'function') {
                let tempRow = _.cloneDeep(this.row);
                for (let item in this.form) {
                    this.form[item] = tempRow[item] || '';
                }
                this.beforeOpenDialog(row);
            }
        }
    };

    page.methods = Object.assign({}, methods, options.methods || '');
    return page;
};
