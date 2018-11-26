/**
 * 页面初始化
 * @param options vue 实例参数
 * @param api 如果有,则覆盖window.curd
 */
window.pageInit = function pageInit(options, api) {
    api = window.curd || api;
    let apiPrefix = options.data.apiPrefix;
    let page = {
        data() {
            let defaults = {
                items: null,
                itemLoading: true,
                total: null,
                query: {
                    pagingQuery: {
                        pageIndex: 1,
                        pageSize: 20
                    }
                },
                dialogFormVisible: false,
                dialogStatus: '',
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
            this.query.page = 1;
            this.getList();
        },
        handleCreate() {
            this.resetForm();
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
            let that = this;
            this.$nextTick(() => {
                that.$refs['dataForm'].clearValidate()
            })
        },
        createData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
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
            this.form = Object.assign({}, row);
            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            });
        },
        editData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const tempData = Object.assign({}, this.form);
                    api.edit(tempData, apiPrefix).then(() => {
                        for (const v of this.items) {
                            if (v.id === this.form.id) {
                                const index = this.items.indexOf(v);
                                this.items.splice(index, 1, this.form);
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
                    let query = {
                        id: row.id
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
        resetForm() {
            Object.keys(this.form).forEach(item => {
                this.form[item] = '';
            });
            if (this[this.dateName]) {
                this[this.dateName] = '';
            }
        },
        getList() {
            this.itemLoading = true;
            api.queryList(this.query, apiPrefix).then(response => {
                this.items = response.data.models;
                this.total = response.data.paging.total || 0;
                this.itemLoading = false
            });
        }
    };

    page.methods = Object.assign({}, methods, options.methods || '');

    return page;
};
