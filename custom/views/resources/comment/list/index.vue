<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="queryItem.name.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>

        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column label='主体' width="200">
                <template slot-scope="scope">
                    {{scope.row.subject}}
                </template>
            </el-table-column>
            <el-table-column label='id' width="200">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column label='主体名称' width="200">
                <template slot-scope="scope">
                    {{scope.row.subjectSummary}}
                </template>
            </el-table-column>

            <el-table-column label='评论者' width="200">
                <template slot-scope="scope">
                    {{scope.row.userName}} #{{scope.row.userId}}
                </template>
            </el-table-column>

            <el-table-column label='评论内容' min-width="300">
                <template slot-scope="scope">
                    <p>{{scope.row.content}}</p>
                    <p v-for="item in scope.row.commentAts">
                        <el-tag type="success">
                            {{item.userName}} #{{item.userId}} : @{{item.atUserNames}}#{{item.atUserIds}}
                            {{item.content}}
                        </el-tag>
                        <el-button size="mini" type="primary"
                                   @click="handleUpdate(item, replyEditItem ,replyEditItem.options)">编辑
                        </el-button>
                    </p>

                </template>
            </el-table-column>

            <el-table-column label='置顶' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.top ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>

            <el-table-column label='评论时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>


            <el-table-column align="center" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini"
                               @click="handleUpdate(scope.row,commentEditItem, commentEditItem.options)">编辑
                    </el-button>
                    <el-button type="primary" size="mini"
                               @click="handleUpdate(scope.row,replyItem , replyItem.options)">回复
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

            <el-form :rules="replyItem.rules" ref="replyForm" :model="replyItem.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;' v-if="dialogStatus ==='reply'">
                <el-form-item :label="'回复对象'" prop="name">
                    {{form.target}}
                </el-form-item>
                <el-form-item :label="'回复内容'" prop="content">
                    <el-input v-model="form.content" placeholder="回复内容"></el-input>
                </el-form-item>

            </el-form>

            <el-form :rules="commentEditItem.rules" ref="commentEditItem" :model="commentEditItem.form"
                     label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;' v-if="dialogStatus ==='commentEditUpdate'">
                <el-form-item :label="'置顶'">
                    <el-switch
                        v-model="form.top"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item :label="'屏蔽'">
                    <el-switch
                        v-model="form.disable"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>

            <el-form :rules="replyEditItem.rules" ref="replyEditItem" :model="replyEditItem.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;' v-if="dialogStatus ==='replyEditItemUpdate'">
                <el-form-item :label="'屏蔽'">
                    <el-switch
                        v-model="form.disable"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveData(replyItem)" v-if="dialogStatus ==='reply'"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
                <el-button type="primary" @click="saveData(commentEditItem)" v-if="dialogStatus ==='commentEditUpdate'"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
                <el-button type="primary" @click="saveData(replyEditItem)" v-if="dialogStatus ==='replyEditItemUpdate'"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    let page = new pageInit(
        {
            data: {
                replyEditItem: {
                    form: {
                        disable: '',
                        id: ''
                    },
                    formName: 'replyEditItem',
                    options: {
                        dialogStatus: 'replyEditItemUpdate'
                    },
                    pageData: {
                        idKey: 'commentId',
                        request:{
                            queryEdit: {
                                url: '/comments/ats/edit'
                            }
                        }
                    }
                },
                commentEditItem: {
                    form: {
                        disable: '',
                        id: '',
                        top: ''
                    },
                    formName: 'commentEditItem',
                    options: {
                        dialogStatus: 'commentEditUpdate'
                    },
                    pageData: {
                        request: {
                            queryEdit: {
                                url: '/comments/edit'
                            }
                        }
                    }
                },
                replyItem: {
                    form: {
                        commentId: '',
                        //名称
                        content: '',
                        userId: '',
                        userName: '',
                        target: ''
                    },
                    rules: {
                        content: [{ required: true, message: '回复内容不能为空', trigger: 'blur' }]
                    },
                    formName: 'replyForm',
                    options: {
                        dialogStatus: 'reply'
                    },
                    pageData: {
                        request: {
                            queryEdit: {
                                url: '/comments/ats/add'
                            }
                        }
                    }
                },
                //查询对象
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate: ';'
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/comments'
                }
            },
            methods: {
                beforeOpenDialog(row) {
                    if (this.dialogStatus === 'reply') {
                        this.textMap.reply = '回复'
                        this.replyItem.form.userId = this.home.user.id
                        this.replyItem.form.userName = this.home.user.name
                        this.replyItem.form.content = ''
                        this.replyItem.form.target = row.userName + ' # ' + row.userId
                        this.replyItem.form.commentId = row.id
                    }
                },
                beforeEditRequest(row) {
                    if (this.dialogStatus === 'reply') {
                        this.postForm = _.cloneDeep(this.replyItem.form)
                        delete this.postForm.target
                        delete this.postForm.id
                    }
                }
            },
            created() {
                this.textMap.replyEditItemUpdate = '回复编辑'
                this.textMap.commentEditUpdate = '评论编辑'
                this.textMap.reply = '回复'
            },
            computed: {
                ...mapGetters([
                    'home'
                ])
            }
        }
    )
    export default page
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .el-tag {
        margin-bottom: 10px;
    }
</style>
