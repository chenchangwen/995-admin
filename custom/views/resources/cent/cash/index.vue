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
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='用户ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.userId}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='账号' width="200">
                <template slot-scope="scope">
                    <p>主体:{{scope.row.centSubject}}</p>
                    <p>主体ID:{{scope.row.centId}}</p>
                </template>
            </el-table-column>
            <el-table-column align="left" label='提现信息' width="200">
                <template slot-scope="scope">
                    <p>提现到:{{scope.row.targetSubject}}</p>
                    <p>账号类别:{{scope.row.targetSubjectAccountClass}}</p>
                    <p>账号:{{scope.row.targetSubjectAccountId}}</p>
                    <p>拥有人:{{scope.row.targetSubjectId}}</p>
                </template>
            </el-table-column>
            <el-table-column align="left" label='提现金额' width="150">
                <template slot-scope="scope">
                    {{scope.row.originalNumber}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='最终提出' width="150">
                <template slot-scope="scope">
                    {{scope.row.number}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='手续费' width="150">
                <template slot-scope="scope">
                    {{scope.row.containFee}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='操作信息' width="200">
                <template slot-scope="scope">
                    <p>原因:{{scope.row.summary}}</p>
                    <p>操作人:{{scope.row.operationUserId}}</p>
                    <p>审核时间:{{scope.row.operationDate}}</p>
                </template>
            </el-table-column>
            <el-table-column label="申请时间" width="155" align="left">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column align="left" :label="'操作'">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status==='NEW'" type="primary" size="mini"
                               @click="handleUpdate(scope.row,commonForm, commonForm.agreeOptions)">通过
                    </el-button>
                    <el-button v-if="scope.row.status==='NEW'" type="danger" size="mini"
                               @click="handleUpdate(scope.row,commonForm, commonForm.refuseOptions)">拒绝
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="commonForm.rules" ref="commonForm" :model="commonForm.form" label-position="left"
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
                <el-form-item :label="'拒绝原因'" prop="summary" v-if="dialogStatus === 'refuse'">
                    <el-input v-model="form.summary"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveData(commonForm)"
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
                commonForm: {
                    form: {
                        centSubject: '',
                        centSubjectId: '',
                        targetSubject: '',
                        targetSubjectId: '',
                        targetSubjectSummary: '',
                        targetSubjectAccountClass: '',
                        targetSubjectAccountId: '',
                        targetSubjectAccountUserName: '',
                        summary: '',
                    },
                    rules: {
                        summary: [{required: true, message: '拒绝原因不能为空', trigger: 'blur'}],
                    },
                    agreeOptions: {
                        dialogStatus: 'agree',
                    },
                    refuseOptions: {
                        dialogStatus: 'refuse',
                    },
                    pageData: {
                        isEditedAssignRow: true
                    },
                    formName: 'commonForm'
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
                apiPrefix: '/cents/cashes'
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
                beforeEdit(row) {
                    this.postForm = {
                        id: row.id,
                        operationUserId: parseInt(this.home.username)
                    };
                    if (this.dialogStatus === 'agree') {
                        this.postForm.summary ='';
                        this.commonForm.pageData.apiQueryEditUrl = '/confirm';
                    }
                    if (this.dialogStatus === 'refuse') {
                        this.postForm.summary = this.commonForm.form.summary;
                        this.commonForm.pageData.apiQueryEditUrl = '/refuse';
                    }
                }
            }
        }
    );
    export default page;
</script>
