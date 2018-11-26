<template>
    <div class="app-container">
        <!--<ul id="images">-->
            <!--<li><img src="http://placehold.it/200x300/f69/fff" alt="Picture 1"></li>-->
            <!--<li><img src="http://placehold.it/200x300/f69/fff" alt="Picture 2"></li>-->
            <!--<li><img src="http://placehold.it/200x300/f69/fff" alt="Picture 3"></li>-->
        <!--</ul>-->
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="query.name">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label='ID' width="95">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column label="名称">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column label="介绍" width="110" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.info}}</span>
                </template>
            </el-table-column>
            <el-table-column label="开始时间" width="110" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.beginTime | parseTime('{y}-{m}-{d}')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" width="110" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.endTime | parseTime('{y}-{m}-{d}')}} </span>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'" width="230" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="form" label-position="left" label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item :label="'开始时间'" prop="beginTime">
                    <el-date-picker v-model="form.beginTime" type="date" placeholder="开始时间"
                                    :picker-options="beginTimeOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="'结束时间'" prop="endTime">
                    <el-date-picker v-model="form.endTime" type="date" placeholder="结束时间"
                                    :picker-options="endTimeOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="'介绍'">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="介绍"
                              v-model="form.info">
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
    let exhibitionPage = new pageInit(
        {
            data: {
                form: {
                    name: '',
                    info: '',
                    beginTime: '',
                    endTime: '',
                },
                rules: {
                    name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    beginTime: [{type: 'date', required: true, message: '开始时间不能为空', trigger: 'change'}],
                    endTime: [{type: 'date', required: true, message: '结束时间不能为空', trigger: 'change'}],
                },
                apiPrefix: '/expo/exhibition'
            },

        }
    );
    export default exhibitionPage;
</script>
