/**
 * 页面初始化
 * @param options vue 实例参数
 * @param api 如果有,则覆盖window.curd
 */
import {mergeSameRow, setSameRowSign, deepClearObject} from '../../utils';

window.pageInit = function pageInit(options) {
    let api = window.curd;
    let page = {
        data() {
            let defaults = {
                //表单 -> 当前dialog
                //新增,更新时实际操作的对象,所以缓存1层
                form: {},
                //如果存,则使用postForm替换掉form,但不影响form
                //postForm: {},
                //form最原始的模型,不能更改
                originForm: {},
                //表格的当行数据对象
                row: {},
                //更新,删除时的对象id键
                idKey: 'id',
                //表格的全部行数据对象
                items: null,
                //全部行数据是否加载中
                itemsLoading: true,
                total: null,
                query: {
                    page: 0,
                    size: 10
                },
                //RSQL查询对象
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
                apiQueryListUrl: '',
                apiQueryAddUrl: '',
                apiQueryEditUrl: '',
                apiQueryDeleteUrl: '',
                apiQueryCountUrl: '',
                apiQueryConfirmUrl: '',
                apiQueryUrl: '',
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
                //是否编辑成功后合并row
                //默认:true , 用最大的差去合并
                //因为后端接口返回成功不一定返回一个row,所以根据情况去使用
                //true:  合并 response.data 到 this.row
                //false: 合并 this.form 到 this.row
                isEditedAssignRow: true,
                //是否设置相同行标记
                isSetSameRowSign: false,
                //在mounted请求数据之前回调
                beforeRequestMounted: '',
                //在mounted请求数据之后回调
                afterRequestMounted: '',
                //不请求数据时回调,一般在新增页面
                noRequestMounted: '',
                //编辑数据请求之前回调
                beforeEditRequest: '',
                //打开dialog之前回调
                //beforeOpenDialog: '',
                //关闭dialog之后回调
                //afterCloseDialog: ''
            };
            return _.assign({}, defaults, options.data || '');
        },
        mounted() {
            if (_.isFunction(this.beforeRequestMounted)) {
                this.beforeRequestMounted(pageData);
            }
            if (this.apiPrefix || this.apiQueryListUrl) {
                this._getList()
            } else if (this.$route.params.id) {
                this._getDetail()
            }
            //tagsView切换提存在响应所以清空
            else {
                let item = this.initItemFormName;
                if (item) {
                    deepClearObject(this[item].form);
                }
                if (_.isFunction(this.noRequestMounted)) {
                    this.noRequestMounted(pageData);
                }
            }
        }
    };

    //页面基础数据
    let pageData = page.data();

    //页面基础方法
    let methods = {
        _notify(options) {
            let defaults = {
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
            };
            let option = _.assignIn(defaults, options);
            this.$notify(option)
        },
        /**
         * 请求列表数据
         */
        _getList() {
            this.itemsLoading = true;
            this.setQueryItem();
            let that = this;
            this._queryData(api.queryList, false, function (pgData, response) {
                that.items = response.data;
                that.itemsLoading = false;
                if (that.isSetSameRowSign) {
                    setSameRowSign.call(that, that.items)
                }
                if (that.isQueryCount) {
                    api.queryCount(that.query, pageData).then(response => {
                        that.total = response.data;
                    })
                }
            })
        },
        /**
         * 请求详情数据
         * 一般针对编辑页面
         */
        _getDetail() {
            let that = this
            if (this.apiQueryDetailUrl) {
                api.queryDetail({id: this.$route.params.id}, pageData).then(response => {
                    if (_.isFunction(that.afterRequestMounted)) {
                        that.afterRequestMounted(response);
                    }
                })
            }
            else if (this.apiQueryUrl) {
                pageData.apiQueryUrl = this.apiQueryUrl;
                api.queryUrl(pageData).then(response => {
                    if (_.isFunction(that.afterRequestMounted)) {
                        that.afterRequestMounted(response);
                    }
                })
            }
        },
        _createData() {
            let that = this
            delete this.form.id;
            this._queryData(api.queryAdd, true, function (pgData, response) {
                if (that.items) {
                    if (that.total < that.query.size) {
                        that.items.splice(0, 0, response.data)
                    }
                    else {
                        that.items.unshift(response.data);
                    }
                }
                that.total = that.total + 1;
                that._notify({message: '创建成功'})
            })
        },
        _editData() {
            let that = this
            this._queryData(api.queryEdit, true, function (pgData, response) {
                if (that.items) {
                    //遍历items,即所有row.id和当前row.id对比正确后.更新当前row,那就不必重新请求接口获取数据
                    for (const v of that.items) {
                        //可能当前操作的row相对来说不是一级的,那么这个row的id相对来说就是不正确的通过page.idKey更换
                        if (v[that.idKey || 'id'] === pgData.idKey || that.form.id) {
                            const index = that.items.indexOf(v)
                            if (pgData.isEditedAssignRow) {
                                that.row = _.assignIn(that.row, response.data)
                            } else {
                                that.row = _.assignIn(that.row, that.form)
                            }

                            if (_.isFunction(that.afterCloseDialog)) {
                                that.afterCloseDialog(that.row)
                            }

                            that.items.splice(index, 1, that.row)
                            break
                        }
                    }
                }
                that._notify({message: '更新成功'})
            })
        },
        /**
         * 获取编辑请求数据之前的pageData
         */
        _getBeforeEditRequestPageData() {
            if (_.isFunction(this.beforeEditRequest)) {
                this.beforeEditRequest(this.row)
            }
            if (this.item && this.item.pageData) {
                return _.assign({}, pageData, this.item.pageData);
            }
            else {
                return pageData;
            }
        },
        _checkItem(item) {
            if (item && !this.item) {
                this.setItem(item)
            }
        },
        /**
         * 请求接口数据
         */
        _queryData(queryFn, isValidate, onSuccess, query) {
            let that = this

            function apiQuery() {
                that.dialogButtonLoading = true
                that.dialogButtonDisabled = true
                let pgData = that._getBeforeEditRequestPageData()

                queryFn(query || (that.postForm || that.form), pgData).then((response) => {
                    if (typeof onSuccess === 'function') {
                        onSuccess(pgData, response)
                    }
                    that.dialogFormVisible = false
                    that.dialogButtonLoading = false
                    that.dialogButtonDisabled = false
                }).catch(_ => {
                    that.itemsLoading = false;
                    that.dialogButtonLoading = false
                    that.dialogButtonDisabled = false
                })
            }

            if (isValidate) {
                this.$refs[this.item.formName].validate((valid) => {
                    if (valid) {
                        apiQuery()
                    }
                })
            } else {
                apiQuery()
            }
        },
        handleFilter() {
            this.query.page = 0;
            this._getList();
        },
        handleCreate(item, options) {
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
        handleDelete(row, item, options) {
            let that = this;
            if (!row[that.idKey]) {
                return false
            }
            this.dialogStatus = (options && options.dialogStatus) || 'delete';
            this.setItem(item);
            this.row = _.cloneDeep(row);
            let pgData = this._getBeforeEditRequestPageData();
            let defaults = {
                title: '提示',
                text: '确定删除',
                options: {
                    type: 'warning'
                }
            };
            let confirm = _.assignIn(defaults, (options && options.confirmOptions));
            this.$confirm(confirm.text, confirm.title, confirm.options).then(_ => {
                let that = this;
                let query = {
                    id: row[pgData.idKey || that.form.id]
                };
                api.queryConfirm(this.postForm || query, pgData).then((response) => {
                    that._getList();
                });
            }).catch(_ => {

            });
        },
        /**
         * 与handleDelete逻辑一样,但更具体的处理需要confirm确认类api.
         */
        handleConfirm(row, item, options) {
            this.handleDelete(row, item, options);
        },
        /**
         * 请求保存数据
         */
        saveData(item) {
            this._checkItem(item)
            if (item.form && !item.form.id) {
                this._createData()
            }
            else {
                this._editData()
            }
        },
        /**
         * 设置Item
         * 当前操作的项
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
            if (!item.pageData) {
                item.pageData = {};
            }
            this.postForm = '';
        },
        /**
         * 重置表单
         */
        resetForm() {
            if (this.dialogStatus === 'create') {
                this.$nextTick(() => {
                    //编辑和新增都会调用setItem,resetForm方法
                    //此时的item.form会有值,所有在此将重置item.form
                    this.$nextTick(() => {
                        if (this.$refs[this.item.formName]) {
                            this.$refs[this.item.formName].resetFields()
                        }
                        deepClearObject(this.item.form);
                    })
                })
            }
            this.dialogFormVisible = true;
            this.dialogButtonLoading = false;
            this.dialogButtonDisabled = false;
            this.clearValidate();
        },
        /**
         * 清除验证
         */
        clearValidate() {
            let formName = this.item.formName;
            if (this.$refs[formName]) {
                this.$nextTick(() => {
                    this.$refs[formName].clearValidate()
                })
            }
        },
        /**
         * 设置窗口对象
         */
        setDialogItem(row) {
            this.postForm = '';
            for (let item in this.form) {
                this.form[item] = _.isBoolean(row[item]) ? row[item] : (row[item] || '');
            }
            if (!this.form['id']) {
                this.form['id'] = row['id'] || '';
            }
            if (_.isFunction(this.beforeOpenDialog)) {
                this.beforeOpenDialog(row);
            }
        },
        /**
         * 排序改变事件
         */
        handleSortChange({column, prop, order}) {
            let sort = (order === 'ascending' ? 'asc' : 'desc')
            if (prop) {
                this.query.sortField = prop
                this.query.sortDirection = sort
            } else {
                delete this.query.sortField
                delete this.query.sortDirection
            }
            this._getList()
        },
        /**
         * 设置查询对象
         * 针对RSQL处理
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

    //增加mergeSameRow方法
    if (pageData.isSetSameRowSign) {
        methods.mergeSameRow = mergeSameRow;
    }

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
