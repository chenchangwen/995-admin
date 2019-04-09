<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户ID/姓名/手机'"
                      v-model="queryItem.name.value" clearable>
            </el-input>

            <!--<el-select class="filter-item" style="width: 120px" clearable v-model="queryItem.sex.value"-->
            <!--placeholder="性别">-->
            <!--<el-option-->
            <!--v-for="item in sexOptions"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
            <!--</el-option>-->
            <!--</el-select>-->

            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(createItem)" type="primary"
                       icon="el-icon-edit">添加
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='用户ID' width="95">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column label="名称" width="150" align="left">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>

            <el-table-column label="角色" width="200" align="left">
                <template slot-scope="scope">
                    <div v-for="item of scope.row.authorities">
                        <p>{{item.name}}</p>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="手机号" width="150" align="left">
                <template slot-scope="scope">
                    {{scope.row.mobile}}
                </template>
            </el-table-column>

            <el-table-column label="是否有效" width="110" align="left">
                <template slot-scope="scope">
                    <i :class="scope.row.userDetail.enabled ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>

            <el-table-column label="创建时间" width="155" align="left">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>

            <el-table-column align="left" :label="'操作'" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" style="width: 110px"
                               @click="handleUpdate(scope.row,editItem)">登录用户后台
                    </el-button>
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row,editItem)">编辑</el-button>
                    <el-button type="primary" size="mini" style="width: 80px"
                               @click="handleUpdate(scope.row,changePasswordItem, changePasswordItem.options)">
                        修改密码
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="editItem.rules" ref="editForm" :model="editItem.form" label-position="left"
                     v-if="dialogStatus ==='update'"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'用户ID'">
                    {{form.id}}
                </el-form-item>
                <el-form-item :label="'用户名称'" prop="name">
                    <el-input v-model="form.name" placeholder="用户名称"></el-input>
                </el-form-item>
                <el-form-item :label="'用户角色'" prop="authorities">
                    <select-role :value.sync="form.authorities"></select-role>
                </el-form-item>

                <el-form-item :label="'手机号'" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="手机号" maxlength="11"></el-input>
                </el-form-item>

                <el-form-item :label="'是否可用'">
                    <el-switch
                            v-model="form.userDetail.enabled"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>

            <el-form :rules="changePasswordItem.rules" ref="changePasswordForm" :model="changePasswordItem.form"
                     label-position="left"
                     v-if="dialogStatus ==='change'"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'用户ID'">
                    {{form.id}}
                </el-form-item>
                <el-form-item :label="'用户名称'">
                    {{form.name}}
                </el-form-item>
                <el-form-item :label="'新密码'" prop="newRawPassword">
                    <el-input v-model="form.newRawPassword" placeholder="新密码"></el-input>
                </el-form-item>
            </el-form>

            <el-form :rules="createItem.rules" ref="createForm" :model="createItem.form" label-position="left"
                     v-if="dialogStatus ==='create'"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'用户账号'" prop="name">
                    <el-input v-model="form.username" placeholder="用户账号"></el-input>
                </el-form-item>
                <el-form-item :label="'用户角色'" prop="authorities">
                    <select-role :value.sync="form.authorities"></select-role>
                </el-form-item>

                <el-form-item :label="'手机号'" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="手机号" maxlength="11"></el-input>
                </el-form-item>

                <el-form-item :label="'密码'" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
                </el-form-item>

                <el-form-item :label="'确认密码'" prop="rawPassword">
                    <el-input v-model="form.rawPassword" type="password" placeholder="确认密码"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="createData" v-if="dialogStatus==='create'"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
                <el-button type="primary" @click="editData" v-if="dialogStatus!=='create'"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import selectRole from '../../../../components/select-role'
    import {mapGetters} from 'vuex';

    let validatePass2 = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'));
        } else if (value !== pageVue.createItem.form.password) {
            callback(new Error('两次输入密码不一致!'));
        } else {
            callback();
        }
    };
    let pageVue = '';
    let page = new pageInit(
        {
            data: {
                sexOptions: [
                    {
                        value: '女',
                        label: '女'
                    },
                    {
                        value: '男',
                        label: '男'
                    }
                ],
                //创建表单
                createItem: {
                    form: {
                        authorities: [],
                        //明文密码
                        rawPassword: '',
                        //用户名称
                        username: '',
                        password: '',
                        mobile:''
                    },
                    rules: {
                        username: [{required: true, message: '用户名称不能为空', trigger: 'blur'}],
                        authorities: [{required: true, message: '请选择角色', trigger: 'blur'}],
                        password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
                        rawPassword: [
                            {required: true, message: '确认密码不能为空', trigger: 'blur'},
                            {validator: validatePass2, trigger: 'blur'}
                        ]
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
                        sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
                        authorities: [{required: true, message: '请选择角色', trigger: 'blur'}],
                    },
                    formName: 'editForm',
                    pageData: {
                        apiQueryEditName: ''
                    }
                },
                //更改密码表单
                changePasswordItem: {
                    form: {
                        id: '',
                        name: '',
                        newRawPassword: ''
                    },
                    rules: {
                        newRawPassword: [{required: true, message: '新密码不能为空', trigger: 'blur'}],
                    },
                    formName: 'changePasswordForm',
                    options: {
                        dialogStatus: 'change'
                    },
                    pageData: {
                        apiQueryEditName: '/password/reset'
                    }
                },
                //查询对象
                queryItem: {
                    name: [
                        {
                            key: 'id',
                            operation: '==',
                            value: '',
                            predicate: ","
                        },
                        {
                            key: 'name',
                            operation: '==',
                            value: '',
                            predicate: ","
                        },
                        {
                            key: 'mobile',
                            operation: '==',
                            value: '',
                            predicate: ""
                        }
                    ]
                },
                apiPrefix: '/users',
                apiQueryAddName: '/name/add',
            },
            methods: {
                beforeOpenDialog(row) {
                    if (this.dialogStatus === 'update') {
                        delete this.form.userDetail.id;
                        delete this.form.userDetail.userId;
                    }
                    if (this.dialogStatus === 'change') {
                        this.textMap.change = '修改密码';
                    }

                },
                beforeEdit(row) {
                    if (this.dialogStatus === 'create') {
                        this.postForm = _.cloneDeep(this.createItem.form);
                        delete this.postForm.password;
                    }
                    if (this.dialogStatus === 'change') {
                        this.postForm = _.cloneDeep(this.changePasswordItem.form);
                        delete this.postForm.name;
                        delete this.postForm.id;
                        this.postForm.userId = this.home.username;
                    }
                },
                afterCloseDialog(row) {
                    if (this.dialogStatus === 'change') {
                        this.changePasswordItem.form.newRawPassword = '';
                    }
                }
            },
            components: {
                selectRole
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            created() {
                pageVue = this;
            }
        }
    );
    export default page;
</script>
