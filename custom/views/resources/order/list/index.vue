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
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row>
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

            <el-table-column align="left" label='支付方式' width="150">
                <template slot-scope="scope">
                    <div v-for="item of scope.row.orderPayments">
                        <p>{{item.orderPayments}}</p>
                    </div>
                </template>
            </el-table-column>

            <el-table-column align="left" label='交易状态' width="150">
                <template slot-scope="scope">
                    {{scope.row.status}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='支付时间' width="155">
                <template slot-scope="scope">
                    <div v-for="item of scope.row.orderPayments">
                        <p>{{item.payTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="left" label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column align="left" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status==='NEW'" type="primary" style="width: 80px" size="mini"
                               @click="handleUpdate(scope.row,commonItem,commonItem.payOptions)">现金支付
                    </el-button>
                    <el-button v-if="scope.row.status==='NEW'" type="default" style="width: 80px" size="mini"
                               @click="handleUpdate(scope.row,commonItem, commonItem.cancelOptions)">取消订单
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="commonItem" :model="commonItem.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'订单号'">
                    {{form.id}}
                </el-form-item>
                <el-form-item :label="'名称'">
                    {{form.summary}}
                </el-form-item>
                <el-form-item :label="'总金额'">
                    {{form.total || 0}}
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
                commonItem: {
                    form: {
                        userId: '',
                        summary: '',
                        total: 0
                    },
                    formName: 'commonItem',
                    payOptions: {
                        dialogStatus: 'pay',
                    },
                    cancelOptions: {
                        dialogStatus: 'cancel'
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
                apiPrefix: '/orders',
            },
            methods: {
                beforeEditRequest(row) {
                    this.postForm = _.cloneDeep(this.commonItem.form);
                    delete this.postForm.summary;
                    delete this.postForm.total;
                    if (this.dialogStatus === 'pay') {
                        this.commonItem.pageData.apiQueryEditUrl = '/pay/cash';
                    }
                    if (this.dialogStatus === 'cancel') {
                        this.commonItem.pageData.apiQueryEditUrl = '/cancel';
                        delete this.postForm.userId;
                    }
                }
            }
        }
    );
    export default page;
</script>
