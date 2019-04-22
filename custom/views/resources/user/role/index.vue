<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="queryItem.name.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(createItem)" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='ID' width="150">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='名称' width="150">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='拥有资源'>
                <template slot-scope="scope">
                    <span v-for="item of scope.row.resources">
                        <el-tag :class="{'el-tag--success':item.method==='GET'}">{{item.name}}</el-tag>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="left" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row, editItem)"
                               style="width: 80px">编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @open="handleOpen">

            <el-form :rules="createItem.rules" ref="createForm" :model="createItem.form" label-position="left"
                     label-width="80px" v-if="dialogStatus ==='create'"
                     style='margin-left:50px;'>
                <el-form-item :label="'ID'" prop="id">
                    <el-input v-model="form.id" placeholder="ID"></el-input>
                </el-form-item>
                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item :label="'拥有资源'">
                    <select-resource :value.sync="form.resources"></select-resource>
                </el-form-item>
            </el-form>

            <el-form :rules="editItem.rules" ref="editItem" :model="editItem.form" label-position="left"
                     label-width="80px" v-if="dialogStatus ==='update'"
                     style='margin-left:50px;'>
                <el-form-item :label="'Id'">
                    {{form.id}}
                </el-form-item>
                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item :label="'拥有资源'">
                    <select-resource :value.sync="form.resources" :key="editItem.key"></select-resource>
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
    import selectResource from '../../../../components/select-resource'

    let page = new pageInit(
        {
            data: {
                createItem: {
                    form: {
                        id: '',
                        name: '',
                        resources: []
                    },
                    rules: {
                        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    },
                    key: 1,
                    formName: 'createForm'
                },
                editItem: {
                    form: {
                        name: '',
                        resources: []
                    },
                    rules: {
                        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    },
                    key: 1,
                    formName: 'editItem'
                },
                //查询对象
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    id: {
                        key: 'id',
                        operation: '==',
                        value: 'ROLE_*',
                        predicate: ";"
                    },
                },
                idKey: 'id',
                apiPrefix: '/authorities'
            },
            methods: {
                beforeOpenDialog(row) {

                },
                afterCloseDialog(row) {

                },
                handleOpen() {
                    this.createItem.form.resources = [];
                    this.createItem.key += 1;
                    this.editItem.key += 1;
                }
            },
            components: {
                selectResource
            }
        }
    );
    export default page;
</script>
<style lang="scss" scoped>
    .cell {
        .el-tag {
            margin-right: 10px;
            margin-bottom: 10px;
        }
    }
</style>
