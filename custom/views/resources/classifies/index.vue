<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(commonForm)" type="primary"
                       icon="el-icon-edit">新增主题
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='主题' width="300">
                <template slot-scope="scope">
                    {{scope.row.subject}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='用户ID' width="150">
                <template slot-scope="scope">
                    {{scope.row.userId}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column align="left" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

            <el-form :rules="commonForm.rules" ref="commonForm" :model="commonForm.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'用户ID'">
                    {{form.userId}}
                </el-form-item>
                <el-form-item :label="'主题'" prop="subject">
                    <el-input v-model="form.subject" placeholder="主题"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="customCreateData" v-if="dialogStatus==='create'"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
                <el-button type="primary" @click="saveData(commonForm)" v-if="dialogStatus==='update'"
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
                commonForm: {
                    form: {
                        subject: '',
                        userId: ''
                    },
                    rules: {
                        subject: [{required: true, message: '主题不能为空', trigger: 'blur'}],
                    },
                    formName: 'commonForm'
                },
                queryItem: {
                    userId: {
                        key: 'userId',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                },
                isQueryCount: false,
                apiPrefix: '/classifies/subjects',
                apiQueryAddUrl: '/edit',
            },
            methods: {
                customCreateData() {
                    let that = this;
                    let form = _.cloneDeep(this.form);
                    form.classifies = [];
                    form.userId = this.queryItem.userId.value;
                    this.$refs[this.item.formName].validate((valid) => {
                        if (valid) {
                            request({
                                url: '/classifies/subjects/add',
                                method: 'post',
                                data: form
                            }).then(function (response) {
                                that.dialogFormVisible = false;
                                that.$notify({
                                    title: '成功',
                                    message: '更新成功',
                                    type: 'success',
                                    duration: 2000
                                })
                            });
                        }
                    })
                },
                handleUpdate(row){
                    this.$router.push(this.$route.path + "/edit/" +  row.id);
                }
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            created() {
                this.commonForm.form.userId = this.home.username;
                this.queryItem.userId.value = this.home.username;
            }
        }
    );
    export default page;
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
