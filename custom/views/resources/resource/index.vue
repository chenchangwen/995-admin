<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="queryItem.name.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(commonItem)" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row style="width: 100%">
            <el-table-column  label='ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column  label="名称">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column  label="url" width="300">
                <template slot-scope="scope">
                    {{scope.row.url}}
                </template>
            </el-table-column>
            <el-table-column  label="创建时间" width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column label="方法" width="110" >
                <template slot-scope="scope">
                    {{scope.row.method}}
                </template>
            </el-table-column>
            <el-table-column label="描述" width="200" >
                <template slot-scope="scope">
                    {{scope.row.description}}
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'"  >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row,commonItem)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleConfirm(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="commonItem.rules" ref="commonItem" :model="commonItem.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'Id'" v-if="dialogStatus === 'update'">
                   {{form.id}}
                </el-form-item>
                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item :label="'url'" prop="url">
                    <el-input v-model="form.url" placeholder="url"></el-input>
                </el-form-item>
                <el-form-item :label="'方法'" prop="method">
                    <el-select v-model="form.method" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="'描述'" prop="description">
                    <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="描述"
                            v-model="form.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveData(commonItem)" :loading="dialogButtonLoading"
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
                options:[
                    {
                        value: 'GET',
                        label: 'GET'
                    },
                    {
                        value: 'POST',
                        label: 'POST'
                    }
                ],
                commonItem: {
                    form: {
                        //名称
                        name: '',
                        url: '',
                        //方法
                        method: '',
                        //描述
                        description: '',
                    },
                    rules: {
                        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                        url: [{required: true, message: 'url不能为空', trigger: 'blur'}],
                        method: [{required: true, message: '请选择方法', trigger: 'blur'}],
                        description: [{required: true, message: '描述不能为空', trigger: 'blur'}],
                    },
                    formName: 'commonItem'
                },
                //查询对象
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        like: true,
                        predicate:";"
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/resources'
                }
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
