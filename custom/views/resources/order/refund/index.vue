<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户ID'"
                      v-model="queryItem.userId.value">
            </el-input>
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'订单号'"
                      v-model="queryItem.id.value">
            </el-input>

            <el-select v-model="queryItem.status.value" placeholder="状态" style="width: 200px">
                <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='订单号' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>

            <el-table-column align="left" label='项目' width="150">
                <template slot-scope="scope">
                    <div v-for="item of scope.row.orderItems">
                        <p>{{item.name}}</p>
                        <p>{{item.quantity}} * {{item.price}} = {{item.total}}</p>
                    </div>
                </template>
            </el-table-column>

            <el-table-column align="left" label='总价格' width="150">
                <template slot-scope="scope">
                    {{scope.row.total}}
                </template>
            </el-table-column>

            <el-table-column align="left" label='用户ID' width="150">
                <template slot-scope="scope">
                    {{scope.row.userId}}
                </template>
            </el-table-column>

            <el-table-column align="left" label='退款金额' width="150">
                <template slot-scope="scope">
                    {{scope.row.total}}
                </template>
            </el-table-column>

            <el-table-column align="left" label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column align="left" :label="'操作'" width="230" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status==='NEW'" type="primary" size="mini"
                               @click="handleConfirm(scope.row,commonForm, commonForm.agreeOptions)">同意
                    </el-button>
                    <el-button v-if="scope.row.status==='NEW'" type="danger" size="mini"
                               @click="handleConfirm(scope.row,commonForm, commonForm.refuseOptions)">拒绝
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="commonForm" :model="commonForm.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'模版名称'" prop="name">
                    {{form.name}}
                </el-form-item>

                <el-form-item :label="'是否可用'">
                    <el-switch
                        v-model="form.enable"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editData" v-if="dialogStatus!=='create'"
                           :loading="dialogButtonLoading"
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
                statusOptions: [
                    {
                        value: 'NEW',
                        label: 'NEW'
                    },
                    {
                        value: 'PENDING',
                        label: 'PENDING'
                    },
                    {
                        value: 'SHIPPING',
                        label: 'SHIPPING'
                    },
                    {
                        value: 'SUCCESS',
                        label: 'SUCCESS'
                    },
                    {
                        value: 'EXPIRED',
                        label: 'EXPIRED'
                    },
                    {
                        value: 'REFUND',
                        label: 'REFUND'
                    }
                ],
                //创建表单
                commonForm: {
                    form: {
                        enable: true,
                        name: '',
                    },
                    formName: 'commonForm',
                    agreeOptions: {
                        dialogStatus: 'agree',
                        confirmOptions: {
                            text: '确定同意退款'
                        }
                    },
                    refuseOptions: {
                        dialogStatus: 'refuse',
                        confirmOptions: {
                            text: '确定同意退款'
                        }
                    }
                },
                //查询对象
                queryItem: {
                    id: {
                        key: 'id',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    status: {
                        key: 'status',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    userId: {
                        key: 'userId',
                        operation: '==',
                        value: '',
                        predicate: ""
                    }
                },
                idKey: 'id',
                apiPrefix: '/orders/refunds',
            },
            methods: {
                beforeEdit(row) {
                    if (this.dialogStatus === 'agree') {
                        this.commonForm.pageData.apiQueryConfirmName = '/confirm';
                    }
                    if (this.dialogStatus === 'refuse') {
                        this.commonForm.pageData.apiQueryConfirmName = '/refuse';
                    }
                }
            }
        }
    );
    export default page;
</script>
