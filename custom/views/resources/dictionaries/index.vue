<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'主题项'"
                      v-model="queryItem.name.value" >
            </el-input>
            <el-button class="filter-item"  type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(commonItem)" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit
                  highlight-current-row>


            <el-table-column  label='主题' min-width="100">
                <template slot-scope="scope">
                    {{scope.row.subject}}
                </template>
            </el-table-column>


            <el-table-column  label='主题项' min-width="120">
                <template slot-scope="scope">
                    {{scope.row.subjectField}}
                </template>
            </el-table-column>

            <el-table-column  label='名称' width="200">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>

            <el-table-column  label='值' width="200">
                <template slot-scope="scope">

                    整数: {{scope.row.intValue}}
                    <br> 小数: {{scope.row.douValue | numFilter}}
                    <br>字符: {{scope.row.strValue}}
                </template>
            </el-table-column>

            <el-table-column  label='启用' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.enable ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>


            <el-table-column  label='排序' width="100">
                <template slot-scope="scope">
                    {{scope.row.index }}
                </template>
            </el-table-column>


            <el-table-column  label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime }}
                </template>
            </el-table-column>

            <el-table-column align="center" :label="'操作'" width="230">
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
                <el-form-item :label="'主题'" prop="subject">
                    <el-input v-model="commonItem.form.subject" placeholder="主题"></el-input>
                </el-form-item>

                <el-form-item :label="'主题项'" prop="subject">
                    <el-input v-model="commonItem.form.subjectField" placeholder="主题项"></el-input>
                </el-form-item>

                <el-form-item :label="'名称'" prop="subject">
                    <el-input v-model="commonItem.form.name" placeholder="名称"></el-input>
                </el-form-item>


                <el-form-item :label="'整数值'" prop="intValue">
                    <el-input
                        type="number"
                        placeholder="整数值"
                        v-model="commonItem.form.intValue">
                    </el-input>
                </el-form-item>

                <el-form-item :label="'小数值'" prop="douValue">
                    <el-input
                        type="number"
                        placeholder="小数值"
                        v-model="commonItem.form.douValue">
                    </el-input>
                </el-form-item>

                <el-form-item :label="'字符'" prop="strValue">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="字符"
                        v-model="commonItem.form.strValue">
                    </el-input>
                </el-form-item>

                <el-form-item :label="'排序'" prop="index">
                    <el-input
                        type="number"
                        placeholder="排序"
                        v-model="commonItem.form.index">
                    </el-input>
                </el-form-item>


                <el-form-item :label="'启用'" prop="enable">
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
                commonItem: {
                    form: {
                        subject: '',
                        subjectField: '',
                        name: '',
                        intValue: '',
                        douValue: '',
                        strValue: '',
                        index: 0,
                        enable: true
                    },
                    rules: {
                        subject: [{required: true, message: '主题不能为空', trigger: 'blur'}],
                        subjectField: [{required: true, message: '主题项不能为空', trigger: 'blur'}],
                        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    },
                    formName: 'commonItem'
                },
                //查询对象
                queryItem: {
                    name: {
                        key: 'subjectField',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/dictionaries',
                }
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            methods: {
                beforeOpenDialog(row) {

                },
                beforeEditRequest(row) {
                    if(this.dialogStatus === 'update') {
                        this.postForm = _.cloneDeep(this.commonItem.form);
                    }
                },
            },filters: {
                numFilter : function (value) {
                    // 截取当前数据到小数点后两位
                    let realVal = parseFloat(value).toFixed(4)
                    if('NaN' == realVal) realVal = ''
                    return realVal
                }
            }
        }

    );
    export default page;
</script>
