/**
 * 页面初始化
 * @param options vue 实例参数
 * @param api 如果有,则覆盖window.curd
 */
window.pageInit = function pageInit(options, api) {
    api = window.curd || api;
    let page = {
        data() {
            let defaults = {
                //表单 -> 当前dialog
                //新增,更新时实际操作的对象,所以缓存1层
                form: {},
                //如果存,则使用postForm替换掉form,但不影响form
                postForm: {},
                //form最原始的模型,不能更改
                originForm: {},
                //表格的当行数据对象
                row: {},
                //更新,删除时的对象id键
                idKey: 'id',
                items: null,
                itemLoading: true,
                total: null,
                query: {
                    page: 0,
                    size: 10
                },
                queryItem: {},
                dialogFormVisible: false,
                dialogStatus: undefined,
                dialogButtonLoading: false,
                dialogButtonDisabled: false,
                textMap: {
                    update: '编辑',
                    create: '新增'
                },
                //是否查询count接口
                isQueryCount: true,
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
        mounted() {
            this.getList();
        }
    };

    //页面基础数据
    let pageData = page.data();

    //页面基础方法
    let methods = {
        handleFilter() {
            this.query.page = 0;
            this.getList();
        },
        handleCreate(item ,options) {
            this.dialogStatus = (options && options.dialogStatus) || 'create';
            this.setItem(item);
            this.resetForm();
        },
        handleUpdate(row, item, options) {
            this.dialogStatus = (options && options.dialogStatus) || 'update';
            this.setItem(item);
            this.row = _.cloneDeep(row);
            this.setDialogItem(this.row);
            this.resetForm();
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
        createData() {
            this.$refs[this.item.formName].validate((valid) => {
                if (valid) {
                    delete this.form.id;
                    api.queryAdd(this.form, pageData).then((response) => {
                        if (this.total < this.query.size) {
                            this.items.splice(0, 0, response.data)
                        }
                        else {
                            this.items.unshift(response.data);
                        }
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
                    //关闭编辑窗口之后执行
                    if (typeof this.beforeEdit === 'function') {
                        this.beforeEdit(this.row);
                    }
                    let pgData = _.assign({}, pageData, this.item.pageData);
                    api.queryEdit(this.postForm || this.form, pgData).then(() => {
                        for (const v of this.items) {
                            if (v[this.idKey || 'id'] === this.form.id) {
                                const index = this.items.indexOf(v);
                                //关闭编辑窗口之后执行
                                if (typeof this.afterCloseDialog === 'function') {
                                    this.afterCloseDialog(this.row);
                                }
                                this.row = _.assignIn(this.row, this.form);
                                this.items.splice(index, 1, this.row);
                                break;
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
        resetForm() {
            if (this.dialogStatus === 'create') {
                this.$nextTick(() => {
                    this.$refs[this.item.formName].resetFields();
                })
            }
            this.dialogFormVisible = true;
            this.dialogButtonLoading = false;
            this.dialogButtonDisabled = false;
            this.clearValidate();
        },
        getList() {
            if(!this.apiPrefix)
                return false;
            this.itemLoading = true;
            this.setQueryItem();
            let that = this;
            api.queryList(this.query, pageData).then(response => {
                this.items = response.data;
                this.itemLoading = false;
                if (that.isQueryCount) {
                    api.queryCount(this.query, pageData).then(response => {
                        that.total = response.data;
                    })
                }
            });
        },
        /**
         * 设置窗口对象
         */
        setDialogItem(row) {
            this.postForm = '';
            for (let item in this.form) {
                this.form[item] = row[item] || '';
            }
            if (!this.form['id']) {
                this.form['id'] = row['id'] || '';
            }
            //打开编辑窗口之前执行
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
                if (!item.originForm) {
                    item.originForm = _.extend(item.form);
                }
            }
        },
        /**
         * 清除验证
         */
        clearValidate() {
            this.$nextTick(() => {
                this.$refs[this.item.formName].clearValidate();
            });
        },
        /**
         * 设置查询对象
         */
        setQueryItem() {
            let searchList = [];
            this.query.search = '';
            let queryItem = this.queryItem;
            for (let item in queryItem) {
                let searchStr = '';
                let thisItem = queryItem[item];
                if (_.isArrayLike(thisItem)) {
                    if (thisItem.value) {
                        for (let qItem in thisItem) {
                            let q = thisItem[qItem];
                            if (q.key) {
                                searchStr = q.key + q.operation + thisItem.value + q.predicate;
                                searchList.push(searchStr);
                            }
                        }
                    }
                }
                else {
                    if (thisItem.value) {
                        searchStr = thisItem.key + thisItem.operation + thisItem.value + thisItem.predicate;
                        searchList.push(searchStr);
                    }
                }
            }

            if (searchList.length > 0) {
                this.query.search = searchList.join('');
                let lastIndex = this.query.search.length - 1;
                let lastChar = this.query.search.charAt(lastIndex);
                if ([',', ';'].indexOf(lastChar) > -1) {
                    this.query.search = this.query.search.substr(0, lastIndex);
                }
            }
        },
    };

    //合并基础方法
    page.methods = _.assign({}, methods, options.methods || '');
    //合并页面自定义属性
    Object.keys(options).forEach(item => {
        if (item !== 'methods' && item !== 'data') {
            page[item] = options[item];
        }
    });
    return page;
};