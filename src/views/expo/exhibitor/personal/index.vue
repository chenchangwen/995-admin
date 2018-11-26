<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="query.name">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <!--<el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"-->
                       <!--icon="el-icon-edit">新增-->
            <!--</el-button>-->
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>

            <el-table-column label="名称">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column label="手机号码" width="110" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.mobile}}</span>
                </template>
            </el-table-column>
            <el-table-column label="个人介绍" width="110" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.info}}</span>
                </template>
            </el-table-column>
            <el-table-column label="资质证明文件" width="110" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.certificateFileUrl" type="text" @click="getFile(scope.row.certificateFileUrl)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="个人照片文件" width="110" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.personalPhotoFileUrl" type="text" @click="getFile(scope.row.personalPhotoFileUrl)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="作品照片文件" width="110" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.productionPhotoFileUrl" type="text" @click="getFile(scope.row.productionPhotoFileUrl)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="广告文件" width="110" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.advertisementFileUrl" type="text" @click="getFile(scope.row.advertisementFileUrl)">查看</el-button>
                </template>
            </el-table-column>
            <!--<el-table-column align="center" :label="'操作'" width="230" class-name="small-padding fixed-width">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>-->
                    <!--<el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>-->
                <!--</template>-->
            <!--</el-table-column>-->
        </el-table>
        <page></page>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="tempItem" label-position="left" label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="tempItem.name" placeholder="名称"></el-input>
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
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="介绍"
                              v-model="tempItem.info">
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
    let personalPage = new pageInit(
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
                    beginTime: [{type: 'date', required: true, message: '开始时间不能为空', trigger: 'blur'}],
                    endTime: [{type: 'date', required: true, message: '结束时间不能为空', trigger: 'blur'}],
                },
                apiPrefix: '/api/expo/v1/admin/exhibitor/personal'
            },
            methods: {
                getFile(fileUrl){
                    window.open('http://' + fileUrl);
                }
            }
        }
    );
    export default personalPage;
</script>
