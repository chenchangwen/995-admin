<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户ID'"
                      v-model="queryItem.id.value" clearable >
            </el-input>
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户名称'"
                      v-model="queryItem.name.value" clearable >
            </el-input>

            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>

        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='用户ID' width="95">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column label="名称" width="110" align="left">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>

            <el-table-column label="系统账号" width="200" align="left">
                <template slot-scope="scope">
                    <div v-for="item of scope.row.userAccounts">
                        <p>{{item.subject}}:{{item.subjectId}}</p>
                    </div>
                </template>
            </el-table-column>

            <el-table-column align="left" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleChangeId(scope.row,editItem)" style="width: 80px">交换账号</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="editItem.rules" ref="editForm" :model="editItem.form" label-position="left"
                     v-if="dialogStatus ==='update'"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item :label="'角色'" prop="authorities">
                    <select-role :value.sync="form.authorities"></select-role>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex" placeholder="性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="'签名'">
                    <el-input v-model="form.signature" placeholder="签名"></el-input>
                </el-form-item>

                <el-form-item :label="'手机'" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="手机"></el-input>
                </el-form-item>

                <el-form-item :label="'是否可用'">
                    <el-switch
                            v-model="form.userDetail.enabled"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveData(createItem)" v-if="dialogStatus==='create'"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
                <el-button type="primary" @click="saveData(editItem)" v-if="dialogStatus==='update'"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import selectRole from '../../../../components/select-role'
    let page = new pageInit(
        {
            data: {
                //创建表单
                createItem: {
                    form: {
                        authorities: [],
                        //明文密码
                        rawPassword: '',
                        //用户名称
                        username: ''
                    },
                    rules: {
                        username: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                        authorities: [{required: true, message: '请选择角色', trigger: 'blur'}],
                        rawPassword: [{required: true, message: '密码不能为空', trigger: 'blur'}]
                    },
                    formName: 'createForm'
                },
                //编辑表单
                editItem: {
                    form: {
                        //用户名称
                        name: '',
                        //性别
                        sex: '',
                        //签名
                        signature: '',
                        //是否可用
                        userDetail: {
                            enabled: true
                        },
                        authorities: [],
                        mobile: ''
                    },
                    rules: {
                        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    },
                    formName: 'editForm'
                },
                //查询对象
                queryItem: {
                    id: {
                        key: 'id',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate: ""
                    }
                },
                apiPrefix: '/users',
            },
            methods: {
                beforeOpenDialog(row) {
                    if (this.dialogStatus === 'update') {
                        delete this.form.userDetail.id;
                        delete this.form.userDetail.userId;
                    }
                },
                afterCloseDialog(row) {

                },
                handleChangeId(){

                }
            },
            components: {
                selectRole
            }
        }
    );
    export default page;
</script>
