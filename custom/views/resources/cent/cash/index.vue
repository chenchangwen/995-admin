<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户ID'"
                      v-model="queryItem.userId.value">
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
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row style="width: 100%">
            <el-table-column  label='交易号' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>

            <el-table-column  label='账号'>
                <template slot-scope="scope">
                    <p>主体:{{scope.row.centSubject}}</p>
                    <p>主体ID:{{scope.row.centId}}</p>
                    <p>用户:{{scope.row.userId}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='提现信息' width="200">
                <template slot-scope="scope">
                    <p>提现到:{{scope.row.targetSubject}}</p>
                    <p>账号类别:{{scope.row.targetSubjectAccountClass}}</p>
                    <p>账号:{{scope.row.targetSubjectAccountId}}</p>
                    <p>拥有人:{{scope.row.targetSubjectAccountUserName}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='提现金额' width="150">
                <template slot-scope="scope">
                    <p>提现金额:{{scope.row.originalNumber}}</p>
                    <p>手续费:{{scope.row.containFee}}</p>
                    <p>最终提出:{{scope.row.number}}</p>
                </template>
            </el-table-column>


            <el-table-column label="申请时间" width="155" >
                <template slot-scope="scope">
                    {{scope.row.createTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'" width="230">
                <template slot-scope="scope" >

                    <div v-if="scope.row.status==='NEW'">
                        <el-button v-if="scope.row.status==='NEW'" type="primary" size="mini"
                                   @click="handleUpdate(scope.row,commonItem, commonItem.agreeOptions)">通过
                        </el-button>
                        <el-button v-if="scope.row.status==='NEW'" type="danger" size="mini"
                                   @click="handleUpdate(scope.row,commonItem, commonItem.refuseOptions)">拒绝
                        </el-button>
                    </div>
                    <div  v-else>
                       <p>原因:{{scope.row.operationSummary}}</p>
                        <p>操作人:{{scope.row.operationUserId}}</p>
                        <p>审核时间:{{scope.row.operationTime}}</p>
                    </div>

                </template>



            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="commonItem.rules" ref="commonItem" :model="commonItem.form" label-position="left"
                     label-width="150px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'主体'">
                    {{form.centSubject}}
                </el-form-item>
                <el-form-item :label="'账号主体ID'">
                    {{form.centSubjectId}}
                </el-form-item>
                <el-form-item :label="'提现目标'">
                    {{form.targetSubject}}
                </el-form-item>
                <el-form-item :label="'提现目标ID'">
                    {{form.targetSubjectId}}
                </el-form-item>
                <el-form-item :label="'提现目标名称'">
                    {{form.targetSubjectSummary}}
                </el-form-item>
                <el-form-item :label="'目账号类别'">
                    {{form.targetSubjectAccountClass}}
                </el-form-item>
                <el-form-item :label="'目标账号'">
                    {{form.targetSubjectAccountId}}
                </el-form-item>
                <el-form-item :label="'目标账号用户名称'">
                    {{form.targetSubjectAccountUserName}}
                </el-form-item>
                <el-form-item :label="'最终提现金额'">
                    {{form.number}}
                </el-form-item>

                <el-form-item :label="'拒绝原因'" prop="summary" v-if="dialogStatus === 'refuse'">
                    <el-input v-model="form.operationSummary"></el-input>
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
                statusOptions: [
                    {
                        value: 'NEW',
                        label: 'NEW'
                    },
                    {
                        value: 'SUCCESS',
                        label: 'SUCCESS'
                    },
                    {
                        value: 'REFUSE',
                        label: 'REFUSE'
                    }
                ],
                commonItem: {
                    form: {
                        centSubject: '',
                        centSubjectId: '',
                        targetSubject: '',
                        targetSubjectId: '',
                        targetSubjectSummary: '',
                        targetSubjectAccountClass: '',
                        targetSubjectAccountId: '',
                        targetSubjectAccountUserName: '',
                        number: '',
                        operationSummary: '',
                    },
                    rules: {
                        operationSummary: [{required: true, message: '拒绝原因不能为空', trigger: 'blur'}],
                    },
                    agreeOptions: {
                        dialogStatus: 'agree',
                    },
                    refuseOptions: {
                        dialogStatus: 'refuse',
                    },
                    formName: 'commonItem'
                },
                //查询对象
                queryItem: {
                    userId: {
                        key: 'userId',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    status: {
                        key: 'status',
                        operation: '==',
                        value: '',
                        predicate: ""
                    },
                },
                idKey: 'id',
                request: {
                    queryPrefix: '',
                    queryEdit:{},
                    queryList: {
                        url: '/cents/cashes'
                    }
                }
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            created() {
                this.textMap.agree = '通过提现';
                this.textMap.refuse = '拒绝提现';
            },
            methods: {
                beforeEditRequest(row) {
                    this.postForm = {
                        id: row.id,
                        operationUserId: parseInt(this.home.user.id)
                    };
                    if (this.dialogStatus === 'agree') {
                        this.postForm.operationSummary ='同意';
                        this.request.queryEdit.url = '/dashboard/cents/cashes/confirm';
                    }
                    if (this.dialogStatus === 'refuse') {
                        this.postForm.operationSummary = this.commonItem.form.operationSummary;
                        this.request.queryEdit.url = '/cents/cashes/refuse';
                    }
                }
            }
        }
    );
    export default page;
</script>
