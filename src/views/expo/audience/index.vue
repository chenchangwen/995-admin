<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'手机'"
                      v-model="query.mobile">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <!--<el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"-->
                       <!--icon="el-icon-edit">新增-->
            <!--</el-button>-->
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label='ID' width="95">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column label="手机">
                <template slot-scope="scope">
                    {{scope.row.mobile}}
                </template>
            </el-table-column>
            <el-table-column label="访问次数">
                <template slot-scope="scope">
                    {{scope.row.visitCount}}
                </template>
            </el-table-column>
            <el-table-column label="已投票次数">
                <template slot-scope="scope">
                    {{scope.row.voteCount}}
                </template>
            </el-table-column>
            <el-table-column label="已申请的电子票张数">
                <template slot-scope="scope">
                    {{scope.row.ticketCount}}
                </template>
            </el-table-column>
            <el-table-column label="剩余抽奖次数">
                <template slot-scope="scope">
                    {{scope.row.awardChanceCount}}
                </template>
            </el-table-column>
            <el-table-column label="已抽奖次数">
                <template slot-scope="scope">
                    {{scope.row.awardDrawCount}}
                </template>
            </el-table-column>
            <el-table-column label="中奖次数">
                <template slot-scope="scope">
                    {{scope.row.awardWinCount}}
                </template>
            </el-table-column>
            <el-table-column label="微信昵称">
                <template slot-scope="scope">
                    {{scope.row.nickname}}
                </template>
            </el-table-column>
            <el-table-column label="性别">
                <template slot-scope="scope">
                    {{scope.row.sex}}
                </template>
            </el-table-column>
            <el-table-column label="省份">
                <template slot-scope="scope">
                    {{scope.row.province}}
                </template>
            </el-table-column>
            <el-table-column label="城市">
                <template slot-scope="scope">
                    {{scope.row.city}}
                </template>
            </el-table-column>
            <el-table-column label="国家">
                <template slot-scope="scope">
                    {{scope.row.country}}
                </template>
            </el-table-column>
            <el-table-column label="姓名">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column label="公司名称">
                <template slot-scope="scope">
                    {{scope.row.companyName}}
                </template>
            </el-table-column>
        </el-table>
        <page></page>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="tempItem" label-position="left" label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="tempItem.name" placeholder="名称" ></el-input>
                </el-form-item>
                <el-form-item :label="'开始时间'" prop="beginTime">
                    <el-date-picker v-model="tempItem.beginTime" type="datetime" placeholder="开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="'结束时间'" prop="endTime">
                    <el-date-picker v-model="tempItem.endTime" type="datetime" placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="'介绍'">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="介绍" v-model="tempItem.info">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
                <el-button v-else type="primary" @click="editData">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    let andiencePage = new pageInit(
        {
            data: {
                tempItem: {
                    name: '',
                    info: '',
                    beginTime: '',
                    endTime: ''
                },
                rules: {
                    name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    beginTime: [{ type: 'date', required: true, message: '开始时间不能为空', trigger: 'blur' }],
                    endTime: [{ type: 'date', required: true, message: '结束时间不能为空', trigger: 'blur' }],
                },
                apiPrefix: '/expo/audience'
            }
        }
    );
    export default andiencePage;
</script>
