<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="queryItem.name.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(commonItem)" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit
                  highlight-current-row>
            <el-table-column  label='名称' width="200">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column  label='答案概要' min-width="300">
                <template slot-scope="scope">
                    {{scope.row.summary}}
                </template>
            </el-table-column>

            <el-table-column  label='禁用' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.disable ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>


            <el-table-column  label='置顶' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.top ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>

            <el-table-column  label='排序' width="100">
                <template slot-scope="scope">
                    {{scope.row.index}}
                </template>
            </el-table-column>


            <el-table-column  label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>

            <el-table-column align="center" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row,commonItem)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleConfirm(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="commonItem.rules" ref="commonItem" :model="commonItem.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'问题'" prop="name">
                    <el-input v-model="commonItem.form.name" placeholder="问题"></el-input>
                </el-form-item>

                <el-form-item :label="'答案概要'" prop="summary">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="答案"
                        v-model="commonItem.form.summary">
                    </el-input>
                </el-form-item>

                <el-form-item :label="'禁用'">
                    <el-switch
                        v-model="commonItem.form.disable"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>

                <el-form-item :label="'置顶'">
                    <el-switch
                        v-model="commonItem.form.top"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>

                <el-form-item :label="'排序'" prop="index">
                    <el-input
                        type="number"
                        placeholder="排序"
                        v-model="commonItem.form.index">
                    </el-input>
                </el-form-item>

                <el-form-item :label="'答案'" prop="faqDetail.content">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="答案"
                        v-model="commonItem.form.faqDetail.content">
                    </el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveData(commonItem)"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    let page = new pageInit(
        {
            data: {
                commonItem: {
                    form: {
                        name: '',
                        summary: '',
                        faqDetail: {
                            content: "",
                            contentType: ''
                        },
                        top: false,
                        index: 0,
                        disable: false
                    },
                    rules: {
                        name: [{required: true, message: '问题不能为空', trigger: 'blur'}],
                        summary: [{required: true, message: '答案概要不能为空', trigger: 'blur'}],
                        index: [{required: true, message: '排序不能为空', trigger: 'blur'}],

                        'faqDetail.content': [{required: true, message: '答案不能为空', trigger: 'blur'}],
                    },
                    formName: 'commonItem'
                },
                //查询对象
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/faqs',
                }
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            methods: {
                beforeOpenDialog(row) {
                    if (row) {
                        let options = {
                            url: '/faqs/' + row.id,
                            method: 'get'
                        }
                        let that = this;
                        request(options).then(function (response) {
                            that.commonItem.form.faqDetail = {
                                content: response.data.faqDetail.content,
                                contentType: 'textarea'
                            };
                        })
                    }
                },
                beforeEditRequest(row) {
                    if(this.dialogStatus === 'update') {
                        this.postForm = _.cloneDeep(this.commonItem.form);
                        this.postForm.userId = this.home.user.id;
                        this.postForm.faqDetail.contentType = 'textarea';
                    }
                },
            }
        }
    );
    export default page;
</script>
