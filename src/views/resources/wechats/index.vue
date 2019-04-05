<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="queryItem.name.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <!--<el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(commonForm)" type="primary"-->
                       <!--icon="el-icon-edit">新增-->
            <!--</el-button>-->
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label='开发者ID' width="200">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="center" label='名称'>
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column align="center" label='类别'>
                <template slot-scope="scope">
                   {{getTypeText(scope.row.type)}}
                </template>
            </el-table-column>
            <el-table-column align="center" label='秘钥'>
                <template slot-scope="scope">
                    {{scope.row.secret}}
                </template>
            </el-table-column>
            <el-table-column align="center" label='令牌'>
                <template slot-scope="scope">
                    {{scope.row.token}}
                </template>
            </el-table-column>
            <el-table-column align="center" label='原始ID'>
                <template slot-scope="scope">
                    {{scope.row.originalId}}
                </template>
            </el-table-column>
            <el-table-column align="center" label='消息加密秘钥'>
                <template slot-scope="scope">
                    {{scope.row.encodingAesKey}}
                </template>
            </el-table-column>
            <el-table-column align="center" label='角色'>
                <template slot-scope="scope">
                    {{scope.row.role}}
                </template>
            </el-table-column>
            <el-table-column align="center" label='主主机'>
                <template slot-scope="scope">
                    {{scope.row.masterAccessTokenUrl}}
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'" width="230" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row,commonForm)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if="dialogStatus==='update'">
            <el-form :rules="commonForm.rules" ref="commonForm" :model="commonForm.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'开发者ID'" prop="id">
                    {{form.id}}
                </el-form-item>
                <el-form-item :label="'名称'">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item :label="'类别'">
                    <el-select v-model="form.type" placeholder="类别"
                               style="width: 100%">
                        <el-option
                                   v-for="item in typeOptions"
                                   :key="item.id"
                                   :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="'秘钥'" prop="secret">
                    <el-input v-model="form.secret" placeholder="秘钥"></el-input>
                </el-form-item>
                <el-form-item :label="'令牌'">
                    <el-input v-model="form.token" placeholder="令牌"></el-input>
                </el-form-item>
                <el-form-item :label="'原始ID'">
                    <el-input v-model="form.originalId" placeholder="原始ID"></el-input>
                </el-form-item>
                <el-form-item :label="'消息加密'">
                    <el-input v-model="form.encodingAesKey" placeholder="消息加密"></el-input>
                </el-form-item>
                <el-form-item :label="'角色'">
                    <el-input v-model="form.role" placeholder="角色"></el-input>
                </el-form-item>
                <el-form-item :label="'主主机'">
                    <el-input v-model="form.masterAccessTokenUrl" placeholder="主主机"></el-input>
                </el-form-item>
                <el-form-item :label="'微信菜单'">
                    <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="微信菜单"
                            v-model="form.wechatMenu.params">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="createData" v-if="dialogStatus=='create'"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
                <el-button type="primary" @click="editData" v-if="dialogStatus=='update'" :loading="dialogButtonLoading"
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
                commonForm: {
                    form: {
                        id:'',
                        name: '',
                        type: '',
                        secret: '',
                        token: '',
                        originalId: '',
                        encodingAesKey: '',
                        role:'',
                        masterAccessTokenUrl: '',
                        wechatMenu: {
                            params: ''
                        }
                    },
                    rules: {
                        id: [{required: true, message: '开发者ID不能为空', trigger: 'blur'}],
                        secret: [{required: true, message: '秘钥不能为空', trigger: 'blur'}],
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
                    }
                },
                idKey: 'id',
                apiPrefix: '/wechats',
                typeOptions:[
                    {
                        id: 'SERVICE',
                        name: '服务号',
                    },
                    {
                        id: 'SUBSCRIPTION',
                        name: '订阅号',
                    },
                    {
                        id: 'PROGRAM',
                        name: '小程序',
                    },
                    {
                        id: 'COMPANY',
                        name: '企业号',
                    }
                ]
            },
            methods: {
                beforeOpenDialog(row) {
                    if (this.dialogStatus === 'update') {
                        this.postForm = _.cloneDeep(this.commonForm.form);
                        this.postForm.userId = this.home.username;
                        this.postForm.wechatMenu = {
                            params : JSON.stringify(this.commonForm.form.wechatMenu)
                        };
                    }
                },
                afterCloseDialog(row) {

                },
                getTypeText(type){
                    //类别:SERVICE 服务号，SUBSCRIPTION 订阅号,PROGRAM 小程序，COMPANY 企业号
                    if(type === 'SERVICE')
                        return '服务号';
                    else if(type === 'SUBSCRIPTION')
                        return '订阅号';
                    else if(type === 'PROGRAM')
                        return '小程序';
                    else if(type === 'COMPANY')
                        return '企业号';
                }
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            }
        }
    );
    export default page;
</script>
