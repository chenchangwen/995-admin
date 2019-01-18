<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户名称'"
                      v-model="queryItem.name.value" clearable >
            </el-input>

            <el-select class="filter-item" style="width: 120px" clearable v-model="queryItem.sex.value"
                       placeholder="性别">
                <el-option
                        v-for="item in sexOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>

            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(createItem)" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label='ID' width="95">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column label="用户名称" width="110" align="center">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>

            <el-table-column label="创建时间" width="110" align="center">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d}')}}
                </template>
            </el-table-column>
            <el-table-column label="是否可用" width="110" align="center">
                <template slot-scope="scope">
                    <i :class="scope.row.userDetail.enabled ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>

            <el-table-column label="手机" width="120" align="center">
                <template slot-scope="scope">
                    {{scope.row.mobile}}
                </template>
            </el-table-column>

            <el-table-column label="性别" width="110" align="center">
                <template slot-scope="scope">
                    {{scope.row.sex}}
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'" width="230" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row,editItem)">编辑</el-button>
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

            <el-form :rules="createItem.rules" ref="createForm" :model="createItem.form" label-position="left"
                     v-if="dialogStatus ==='create'"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'名称'" prop="username">
                    <el-input v-model="form.username" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item :label="'角色'" prop="authorities">
                    <select-role :value.sync="form.authorities"></select-role>
                </el-form-item>

                <el-form-item :label="'密码'" prop="rawPassword">
                    <el-input v-model="form.rawPassword" type="password" placeholder="密码"></el-input>
                </el-form-item>

                <el-form-item :label="'手机'" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="手机"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="createData" v-if="dialogStatus==='create'"
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
    import selectRole from '@/components/SelectRole'
    //特殊view
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
                        sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
                        authorities: [{required: true, message: '请选择角色', trigger: 'blur'}],
                    },
                    formName: 'editForm'
                },
                //查询对象
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    sex: {
                        key: 'sex',
                        operation: '==',
                        value: '',
                        predicate: ""
                    }
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
                },
                afterCloseDialog(row) {

                }
            },
            components: {
                selectRole
            }
        }
    );
    export default page;
</script>
