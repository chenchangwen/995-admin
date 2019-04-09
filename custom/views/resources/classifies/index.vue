<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(createItem)" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

            <el-form :rules="createItem.rules" ref="createForm" :model="createItem.form" label-position="left"
                     v-if="dialogStatus ==='create'"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'名称'" prop="classifies.name">
                    <el-input v-model="form.classifies.name" placeholder="名称"></el-input>
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
                <el-button type="primary" @click="editData" v-if="dialogStatus==='update'"
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
                createItem: {
                    form: {
                        subject: '',
                        classifies: {
                            name: ''
                        }
                    },
                    rules: {
                        'classifies.name': [{required: true, message: '名称不能为空', trigger: 'blur'}],
                        subject: [{required: true, message: '主题不能为空', trigger: 'blur'}],
                    },
                    formName: 'createForm'
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
                apiQueryAddName: '/edit',
            },
            methods: {
                customCreateData() {
                    let that = this;
                    let form = _.cloneDeep(this.form);
                    form.classifies = [form.classifies];
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
                }
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            created() {
                this.queryItem.userId.value = this.home.username;
            }
        }
    );
    export default page;
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
