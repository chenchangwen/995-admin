<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'关键字'"
                      v-model="query.keyword">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label='ID' width="95">
                <template slot-scope="scope">
                    {{scope.row.userId}}
                </template>
            </el-table-column>
            <el-table-column label="用户名称" width="110" align="center">
                <template slot-scope="scope">
                    {{scope.row.user.name}}
                </template>
            </el-table-column>
            <el-table-column label="是否可用" width="110" align="center">
                <template slot-scope="scope">
                    {{scope.row.user.enabled | parseEnabled()}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="110" align="center">
                <template slot-scope="scope">
                    {{scope.row.user.createTime | parseTime('{y}-{m}-{d}')}}
                </template>
            </el-table-column>
            <el-table-column label="性别" width="110" align="center">
                <template slot-scope="scope">
                    {{scope.row.user.sex}}
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'" width="230" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="form" label-position="left" label-width="80px"
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData"
                           :loading="dialogButtonLoading" :disabled="dialogButtonDisabled">确认
                </el-button>
                <el-button v-else type="primary" @click="editData" :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    let page = new pageInit(
        {
            data: {
                form: {
                    id: '',
                    sex: '',
                    signature: '',
                    name: ''
                },
                idKey: 'userId',
                rules: {
                    name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
                    signature: [{required: true, message: '签名不能为空', trigger: 'blur'}],
                },
                apiPrefix: '/users'
            },
            methods: {
                beforeOpenDialog(row) {
                    this.form.name = row.user.name;
                    this.form.id = row.userId;
                    this.form.sex = row.user.sex;
                    this.form.signature = row.user.signature;
                },
                afterCloseDialog(row) {
                    row.user.name = this.form.name;
                    row.userId = this.form.id;
                    row.user.sex = this.form.sex;
                    row.user.signature = this.form.signature;
                }
            }
        }
    );
    export default page;
</script>
