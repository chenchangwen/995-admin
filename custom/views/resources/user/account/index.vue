<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户id'"
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

            <el-table-column  label='主体'  >
                <template slot-scope="scope">
                    {{scope.row.subject}}
                </template>
            </el-table-column>


            <el-table-column  label='账号' >
                <template slot-scope="scope">
                    {{scope.row.subjectId}}
                </template>
            </el-table-column>


            <el-table-column  label='用户id'  >
                <template slot-scope="scope">
                    {{scope.row.userId}}
                </template>
            </el-table-column>

            <el-table-column  label='启用' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.enable ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>


            <el-table-column align="center" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleConfirm(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="commonItem.rules" ref="commonItem" :model="commonItem.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>


                <el-form-item :label="'主体'"  prop="subject">
                    <el-select v-model="form.subject" placeholder="主题" style="width: 200px">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="'账号'" prop="subjectId">
                    <el-input v-model="commonItem.form.subjectId" placeholder="账号"></el-input>
                </el-form-item>

                <el-form-item :label="'用户Id'" prop="userId">
                    <el-input v-model="commonItem.form.userId" placeholder="用户Id"></el-input>
                </el-form-item>

                <el-form-item :label="'启用'">
                    <el-switch
                        v-model="commonItem.form.enable"
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
                options: [
                    {
                        value: 'wechat-mp',
                        label: '微信'
                    },
                    {
                        value: 'mobile',
                        label: '手机'
                    },
                    {
                        value: 'username',
                        label: '账号'
                    }
                ],
                commonItem: {
                    form: {
                        subject: '',
                        subjectId:'',
                        userId: 0,
                        enable: true
                    },
                    rules: {
                        subject: [{required: true, message: '主题不能为空', trigger: 'blur'}],
                        subjectId: [{required: true, message: '账号不能为空', trigger: 'blur'}],
                        userId: [{required: true, message: '用户id不能为空', trigger: 'blur'}]
                    },
                    formName: 'commonItem'
                },
                //查询对象
                queryItem: {
                    name: {
                        key: 'userId',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/users/accounts',
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
                            url: '/users/accounts/' + row.id,
                            method: 'get'
                        }
                        let that = this;
                        // request(options).then(function (response) {
                        //     that.commonItem.form.faqDetail = {
                        //         content: response.data.faqDetail.content,
                        //         contentType: 'textarea'
                        //     };
                        // })
                    }
                },
                beforeEditRequest(row) {
                    // if(this.dialogStatus === 'update') {
                    //     this.postForm = _.cloneDeep(this.commonItem.form);
                    // }

                    if(this.dialogStatus === 'create' || this.dialogStatus === 'update') {
                        this.postForm = _.cloneDeep(this.commonItem.form);
                        // this.postForm.index = parseInt(this.commonItem.form.index )
                    }
                },
            }
        }
    );
    export default page;
</script>
