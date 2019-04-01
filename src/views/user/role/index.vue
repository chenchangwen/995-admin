<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="queryItem.name.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(commonForm)" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label='ID' width="150">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="center" label='名称' width="150">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column align="center" label='拥有资源'>
                <template slot-scope="scope">
                    <span v-for="item of scope.row.resources">
                        <el-tag type="success" v-if="item.method==='GET'">{{item.name}}</el-tag>
                        <el-tag v-if="item.method==='POST'">{{item.name}}</el-tag>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'" width="230" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row, commonForm)" style="width: 80px">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="commonForm.rules" ref="commonForm" :model="commonForm.form" label-position="left"
                     label-width="80px"
                     style='margin-left:50px;'>
                <el-form-item :label="'Id'" v-if="dialogStatus === 'update'">
                    {{form.id}}
                </el-form-item>
                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item :label="'拥有资源'" prop="name">
                    <select-resource :value.sync="form.resources"></select-resource>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="createData" v-if="dialogStatus==='create'"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
                <el-button type="primary" @click="editData" v-if="dialogStatus==='update'" :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import selectResource from '@/components/SelectResource'
    import {mapGetters} from 'vuex';
    let page = new pageInit(
        {
            data: {
                commonForm: {
                    form: {
                        //名称
                        name: '',
                        resources: ''
                    },
                    rules: {
                        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    },
                    formName: 'commonForm'
                },
                //查询对象
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate:";"
                    },
                    id: {
                        key: 'id',
                        operation: '==',
                        value: 'ROLE_*',
                        predicate:";"
                    },
                },
                idKey: 'id',
                apiPrefix: '/authorities'
            },
            methods: {
                beforeOpenDialog(row) {

                },
                afterCloseDialog(row) {

                }
            },
            components: {
                selectResource
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
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
