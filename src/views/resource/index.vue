<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'关键字'"
                      v-model="query.keyword">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(createItem)" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label='ID' width="180">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column label="名称" width="110" align="center">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column label="url" width="110" align="center">
                <template slot-scope="scope">
                    {{scope.row.url}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="110" align="center">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d}')}}
                </template>
            </el-table-column>
            <el-table-column label="方法" width="110" align="center">
                <template slot-scope="scope">
                    {{scope.row.method}}
                </template>
            </el-table-column>
            <el-table-column label="描述" width="200" align="center">
                <template slot-scope="scope">
                    {{scope.row.description}}
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
                     label-width="80px"
                     v-if="dialogStatus=='update'"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex" placeholder="性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="'签名'" prop="signature">
                    <el-input v-model="form.signature" placeholder="签名"></el-input>
                </el-form-item>
            </el-form>
            <el-form :rules="createItem.rules" ref="createForm" :model="createItem.form" label-position="left"
                     label-width="80px"
                     v-if="dialogStatus=='create'"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'名称'" prop="username">
                    <el-input v-model="form.username" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item :label="'角色'" prop="authorityId">
                    <select-role :value.sync="form.authorityId"></select-role>
                </el-form-item>
                <el-form-item :label="'密码'" prop="rawPassword">
                    <el-input v-model="form.rawPassword" type="password" placeholder="密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="createData" v-if="dialogStatus=='create'" :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
                <el-button type="primary" @click="editData" v-if="dialogStatus=='update'" :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    //特殊view
    let page = new pageInit(
        {
            data: {
                //编辑表单
                editItem: {
                    form: {
                        //性别
                        sex: '',
                        //签名
                        signature: '',
                        //用户名称
                        name: ''
                    },
                    rules: {
                        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                        sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
                        signature: [{required: true, message: '签名不能为空', trigger: 'blur'}],
                    },
                    formName: 'editForm'
                },
                //创建表单
                createItem: {
                    form: {
                        //角色Id
                        authorityId: '',
                        //明文密码
                        rawPassword: '',
                        //用户名称
                        username: ''
                    },
                    rules: {
                        username: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                        authorityId: [{required: true, message: '请选择角色', trigger: 'blur'}],
                        rawPassword: [{required: true, message: '密码不能为空', trigger: 'blur'}]
                    },
                    formName: 'createForm'
                },
                idKey: 'userId',
                apiPrefix: '/resources'
            },
            methods: {
                beforeOpenDialog(row) {

                },
                afterCloseDialog(row) {

                }
            }
        }
    );
    export default page;
</script>
