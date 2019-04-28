<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
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
            <el-table-column align="left" label='名称' width="200">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='答案' width="200">
                <template slot-scope="scope">
                    {{scope.row.faqDetail && scope.row.faqDetail.conetent}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>

            <el-table-column align="left" :label="'操作'" width="230">
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

                <el-form-item :label="'答案'" prop="faqDetail.content">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="答案"
                        v-model="commonItem.form.faqDetail.content">
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
                        faqDetail: {
                            content: "",
                            contentType: ''
                        },
                        top: false,
                        disable: false
                    },
                    rules: {
                        name: [{required: true, message: '问题不能为空', trigger: 'blur'}],
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
                apiPrefix: '/faqs'
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            methods: {
                beforeEditRequest(row) {
                    debugger;
                    this.postForm = _.cloneDeep(this.commonItem.form);
                    this.postForm.userId = this.home.user.id;
                    this.postForm.faqDetail.contentType = 'textarea';
                },
            }
        }
    );
    export default page;
</script>
