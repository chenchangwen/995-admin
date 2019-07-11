<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户ID'"
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

            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(createItem)" type="primary"
                       icon="el-icon-edit">申请提现
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
                    <p>分支:{{scope.row.targetSubjectAccountBranch}}</p>
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
                     v-if="dialogStatus ==='agree' || dialogStatus ==='refuse' "
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


            <el-form :rules="createItem.rules" ref="createForm" :model="createItem.form" label-position="left"
                     v-if="dialogStatus ==='create'"
                     label-width="120px"
                     style='width: 400px; margin-left:50px;'>

                <el-form-item :label="'提现账号主体'" prop="centSubject">
                    <el-input v-model="form.centSubject" placeholder="提现账号主体" ></el-input>
                </el-form-item>

                <el-form-item :label="'提现账号'" prop="centSubject">
                    <el-input v-model="form.centSubjectId" placeholder="提现账号" ></el-input>
                </el-form-item>

                <el-form-item :label="'提现到'"  prop="targetSubject">
                    <el-select v-model="form.targetSubject" placeholder="提现到" style="width: 200px">
                        <el-option
                            v-for="item in targetSubjectOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="'银行名称'"  prop="targetSubjectSummary">
                    <el-input v-model="form.targetSubjectSummary" placeholder="银行名称"></el-input>
                 </el-form-item>

                <el-form-item :label="'卡类别'" prop="targetSubjectAccountClass">
                    <el-input v-model="form.targetSubjectAccountClass" placeholder="银行卡类别" ></el-input>
                </el-form-item>

                <el-form-item :label="'卡号'" prop="targetSubjectAccountId">
                    <el-input v-model="form.targetSubjectAccountId" placeholder="卡号"></el-input>
                </el-form-item>

                <el-form-item :label="'持卡人姓名'" prop="targetSubjectAccountUserName">
                    <el-input v-model="form.targetSubjectAccountUserName" placeholder="持卡人姓名"></el-input>
                </el-form-item>

                <el-form-item :label="'支行名称'" prop="targetSubjectAccountBranch">
                    <el-input v-model="form.targetSubjectAccountBranch" placeholder="支行名称" ></el-input>
                </el-form-item>


                <el-form-item :label="'到账金额'" prop="number">
                    <el-input v-model="form.number" type="number" placeholder="到账金额" ></el-input>
                </el-form-item>

                <el-form-item :label="'手续费'" prop="containFee">
                    <el-input v-model="form.containFee" type="number" placeholder="手续费" ></el-input>
                </el-form-item>



                <el-form-item :label="'提现说明'" prop="summary">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="提现说明"
                        v-model="form.summary">
                    </el-input>
                </el-form-item>



            </el-form>


            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>



                <el-button type="primary" @click="saveData(commonItem)" v-if="dialogStatus==='agree' || dialogStatus==='refuse'"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>

                <el-button type="primary" @click="saveData(createItem)" v-if="dialogStatus==='create'  "
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
                targetSubjectOptions: [
                    {
                        value: 'tencent',
                        label: '腾讯'
                    },
                    {
                        value: 'alibaba',
                        label: '阿里巴巴'
                    },
                    {
                        value: 'bank',
                        label: '银行'
                    },
                    {
                        value: 'cash',
                        label: '现金'
                    }
                ],
                tencentTargetSubjectOptions: [
                    {
                        value: 'wechatpay',
                        label: '微信支付'
                    }
                ],
                talibabaTargetSubjectOptions: [
                    {
                        value: 'alipay',
                        label: '支付宝'
                    }
                ],
                backTargetSubjectOptions: [  // 参考: https://zhidao.baidu.com/question/374879558.html
                    {
                        value: '中国银行',
                        label: '中国银行'
                    },
                    {
                        value: '建设银行',
                        label: '建设银行'
                    },{
                        value: '农业银行',
                        label: '农业银行'
                    },{
                        value: '工商银行',
                        label: '工商银行'
                    },{
                        value: '交通银行',
                        label: '交通银行'
                    },{
                        value: '中信银行',
                        label: '中信银行'
                    },{
                        value: '招商银行',
                        label: '招商银行'
                    },{
                        value: '邮政储蓄银行',
                        label: '邮政储蓄银行'
                    },{
                        value: '光大银行',
                        label: '光大银行'
                    }
                ],
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
                //创建表单
                createItem: {
                    form: {
                        centSubject: '',
                        centSubjectId: '',

                        targetSubject: '',
                        targetSubjectId: '',
                        targetSubjectSummary: '',
                        targetSubjectAccountClass: '',
                        targetSubjectAccountId: '',
                        targetSubjectAccountBranch: '',
                        targetSubjectAccountUserName: '',

                        number: '',
                        containFee: '',

                        userId: '',

                        summary: '',

                    },
                    rules: {
                        centSubject: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
                        centSubjectId: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],

                        // targetSubject: [{ required: true, message: '提现到', trigger: 'blur' }],
                        // targetSubjectId: [{ required: true, message: '提现到', trigger: 'blur' }],
                        // targetSubjectAccountClass: [{ required: true, message: '请选择角色', trigger: 'blur' }],
                        // targetSubjectAccountId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
                        // targetSubjectAccountUserName: [{ required: true, message: '请选择角色', trigger: 'blur' }],

                        number: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
                        containFee: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],


                        summary: [{ required: true, message: '提现说明不能为空', trigger: 'blur' }],

                    },
                    formName: 'createForm'
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
                    queryAdd: {
                        url: '/cents/cashes/add'
                    },
                    queryList: {
                        url: '/cents/cashes'
                    },
                    queryCount: {
                        url: '/cents/cashes/count'
                    }
                }
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            created() {
                this.textMap.create = '申请提现';
                this.textMap.agree = '通过提现';
                this.textMap.refuse = '拒绝提现(积分退回账号.)';
            },
            methods: {
                beforeEditRequest(row) {
                    if(this.dialogStatus === 'agree' || this.dialogStatus === 'refuse'){
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

                    }else if(this.dialogStatus === 'create'){
                        // alert()
                        this.postForm = _.cloneDeep(this.createItem.form)
                        this.postForm.userId = parseInt(this.home.user.id)
                        // this.postForm.userId = parseInt(this.home.user.id);
                        this.request.queryEdit.url = '/cents/cashes/add';
                    }

                }
            }
        }
    );
    export default page;
</script>
