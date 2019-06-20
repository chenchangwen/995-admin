<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'活动名称'"
                      v-model="queryItem.name.value">
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
<!--        <ul id="images">-->
<!--            <li><img style="width: 50px;height: 50px" src="http://pic.k73.com/up/soft/2016/0102/092635_44907394.jpg" alt="Picture 1"></li>-->
<!--            <li><img style="width: 50px;height: 50px" src="http://pic.k73.com/up/soft/2016/0102/092635_44907394.jpg" alt="Picture 2"></li>-->
<!--        </ul>-->
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row
                  style="width: 100%" id="id-table">
            <el-table-column label='ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>

            <el-table-column label='姓名' min-width="100">
                <template slot-scope="scope">
                    {{scope.row.trueName}}
                </template>
            </el-table-column>

            <el-table-column label='手机号码' width="150">
                <template slot-scope="scope">
                    {{scope.row.contacts}}
                </template>
            </el-table-column>

            <el-table-column label='手持证件正面照' width="200">
                <template slot-scope="scope">
                    <img class="card-img" :src="oss + scope.row.imageFront" v-if="scope.row.imageFront" preview/>
                </template>
            </el-table-column>

            <el-table-column label='证件背面照' width="200">
                <template slot-scope="scope">
                    <img class="card-img" :src="oss + scope.row.imageBack" v-if="scope.row.imageBack" preview/>
                </template>
            </el-table-column>

            <el-table-column align="left" label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>

            <el-table-column label='状态' width="150">
                <template slot-scope="scope">
                    {{scope.row.status}}
                </template>
            </el-table-column>

            <el-table-column align="center" :label="'操作'" width="220">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleConfirm(scope.row,commonItem, commonItem.agreeOptions)"
                               size="mini">通过
                    </el-button>
                    <el-button type="danger" @click="handleConfirm(scope.row,commonItem, commonItem.refuseOptions)"
                               size="mini">不通过
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Viewer from 'viewerjs';
    import 'viewerjs/dist/viewer.css';
    let page = new pageInit(
        {
            data: {
                oss : oss,
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
                    agreeOptions: {
                        dialogStatus: 'agree',
                        confirmOptions: {
                            text: '确定通过?'
                        }
                    },
                    refuseOptions: {
                        dialogStatus: 'refuse',
                        confirmOptions: {
                            text: '确定不通过?'
                        }
                    }
                },
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate: ';'
                    },
                    status: {
                        key: 'status',
                        operation: '==',
                        value: '',
                        predicate: ''
                    }
                },
                request: {
                    queryPrefix: '/identifications'
                }
            },
            computed: {
                ...mapGetters([
                    'home'
                ])
            },
            methods: {
                beforeEditRequest(row) {

                    if (this.dialogStatus === 'agree') {
                        this.postForm = {
                            id: row.id,
                            operationSummary: '',
                            operationUserId: this.home.user.id
                        }
                        this.request.queryConfirm = {
                            url: '/confirm'
                        }
                    }

                    if (this.dialogStatus === 'refuse') {
                        this.postForm = {
                            id: row.id,
                            operationSummary: '',
                            operationUserId: this.home.user.id
                        }
                        this.request.queryConfirm = {
                            url: '/refuse'
                        }
                    }
                },
                afterRequestMounted() {
                    this.items[0].imageFront = 'http://pic.k73.com/up/soft/2016/0102/092635_44907394.jpg';
                    // this.items[0].imageBack = 'https://www.baidu.com/img/bd_logo1.png';

                }
            }
        }
    )
    export default page
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    #id-table {
        img {
            width: 178px;
            height: 95px;
            cursor: pointer;
        }
    }
</style>
