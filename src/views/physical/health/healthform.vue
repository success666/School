<template>
  <div class="content">
    <el-form ref="health" :model="health" :rules="rules" label-width="80px" size="mini" class="form-tab">
      <el-row>
        <el-col>
          <el-form-item label="学年：" prop="schoolYear">
            <el-select v-model="health.schoolYear" placeholder="请选择" @change="schoolYearChange">
              <el-option
                v-for="item in schoolYearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="年级：" style="width: 250px;float: left" prop="gradeId">
            <el-select @change="getClass" v-model="health.gradeId" placeholder="请选择" style="width: 100px;">
              <el-option
                v-for="item in gradeOptions"
                :key="item.gradeId"
                :label="item.gradeName"
                :value="item.gradeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级：" style="width: 200px;float: left" prop="classId">
            <el-select v-model="health.classId" placeholder="请选择" style="width: 100px;" @change="getClassName">
              <el-option
                v-for="item in classOptions"
                :key="item.dictClassId"
                :label="item.dictClassName"
                :value="item.dictClassId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="姓名：" style="width: 250px;float: left" prop="name">
            <el-input v-model="health.name" class="text-input"></el-input>
          </el-form-item>
          <el-form-item label="性别：" style="width: 250px;float: left" prop="sex">
            <el-radio v-model="health.sex" label=1 >男</el-radio>
            <el-radio v-model="health.sex" label=2 >女</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="border-bottom: 1px solid #e6e6e6;">
        <el-col>
          <el-form-item label="身份证/国外护照：" label-width="160px" prop="identityType" style="width: 350px;float: left">

            <el-select v-model="health.identityType" placeholder="请选择" @change="identityTypeChange">
              <el-option
                v-for="item in identityTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="identityNo" style="width: 250px;float: left">
            <el-input v-model="health.identityNo" style="width: 250px;" placeholder="请输入证件号码" class="text-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="health.identityType !== 1">
        <el-col>
          <el-form-item label="出生日期：" label-width="105px" class="born-date" prop="birthday">
            <el-date-picker
              v-model="health.birthday" :picker-options="pickerDate"
              type="date"
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="体检时间：" label-width="110px" prop="healthExamTime">
            <el-date-picker
              v-model="health.healthExamTime" :picker-options="pickerDate"
              type="date"
             >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-collapse v-model="activeArr">
            <el-collapse-item class="collapse" name="1">
              <template slot="title">
                <span class="collapse-title-left">身体形态</span>
              </template>
              <table class="table" style="width: 100%">
                <tbody>
                <tr>
                  <th width="30%">项目</th>
                  <th width="30%">结果</th>
                  <th width="40%">单位</th>
                </tr>
                <tr >
                  <td  style="text-align: center">身高</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="height" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.height" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">cm</td>
                </tr>
                <tr >
                  <td  style="text-align: center">体重</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="weight" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.weight" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">kg</td>
                </tr>
                <!--<tr >-->
                  <!--<td  style="text-align: center">身体质量指数</td>-->
                  <!--<td  style="text-align: center">-->
                    <!--<div class="customInput-equipmentForm input-div">-->
                      <!--<el-form-item prop="bodyMassIndex" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">-->
                        <!--<el-input class="input-width" v-model="health.bodyMassIndex" ></el-input>-->
                      <!--</el-form-item>-->
                    <!--</div>-->
                  <!--</td>-->
                  <!--<td  style="text-align: center">kg/m^2</td>-->
                <!--</tr>-->
                </tbody>
              </table>
            </el-collapse-item>
            <el-collapse-item class="collapse" name="2">
              <template slot="title">
                <span class="collapse-title-left">身体机能</span>
              </template>
              <table class="table" style="width: 100%">
                <tbody>
                <tr>
                  <th width="30%">项目</th>
                  <th width="30%">结果</th>
                  <th width="40%">单位</th>
                </tr>
                <tr >
                  <td  style="text-align: center">安静心率</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="quietHeartRate" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.quietHeartRate" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">b/min</td>
                </tr>
                <tr >
                  <td  style="text-align: center">收缩压（血压）</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="systolicPressure" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.systolicPressure" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">mmHg</td>
                </tr>
                <tr >
                  <td  style="text-align: center">舒张（血压）</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="diastolicBloodPressure" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.diastolicBloodPressure" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">mmHg</td>
                </tr>
                <tr >
                  <td  style="text-align: center">肺活量</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="lungCapacity" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.lungCapacity" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">ml</td>
                </tr>
                </tbody>
              </table>
            </el-collapse-item>
            <el-collapse-item class="collapse" name="3">
              <template slot="title">
                <span class="collapse-title-left">内科</span>
              </template>
              <table class="table" style="width: 100%">
                <tbody>
                <tr>
                  <th width="30%">项目</th>
                  <th width="30%">结果</th>
                  <th width="40%"></th>
                </tr>
                <tr >
                  <td  style="text-align: center">心</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.heart">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">肺</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.lung">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">肝</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.liver">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">脾</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.spleen">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                </tbody>
              </table>
            </el-collapse-item>
            <el-collapse-item class="collapse" name="4">
              <template slot="title">
                <span class="collapse-title-left">外科</span>
              </template>
              <table class="table" style="width: 100%">
                <tbody>
                <tr>
                  <th width="30%">项目</th>
                  <th width="30%">结果</th>
                  <th width="40%"></th>
                </tr>
                <tr >
                  <td  style="text-align: center">头</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.head">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">颈</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.neck">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">淋巴结</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.lymphNode">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">甲状腺</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.thyroidGland">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">胸廓</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.thoracic">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">脊柱</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.spine">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">四肢</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.limbs">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">扁平足</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.flatFeet">
                        <el-option v-for="item in yMOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">腹部</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.abdomen">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">皮肤</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.skin">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">乳腺</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.mammaryGland">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">生殖器</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.genital">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                </tbody>
              </table>
            </el-collapse-item>
            <el-collapse-item class="collapse" name="5">
              <template slot="title">
                <span class="collapse-title-left">眼科</span>
              </template>
              <table class="table" style="width: 100%">
                <tbody>
                <tr>
                  <th width="30%">项目</th>
                  <th width="30%">结果</th>
                  <th width="40%"></th>
                </tr>
                <tr >
                  <td  style="text-align: center">左眼视力</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="leftEyeEyesight" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.leftEyeEyesight" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">右眼视力</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="rightEyeEyesight" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.rightEyeEyesight" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">沙眼</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.trachoma">
                        <el-option v-for="item in yMOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">结膜炎</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.conjunctivitis">
                        <el-option v-for="item in yMOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                </tbody>
              </table>
            </el-collapse-item>
            <el-collapse-item class="collapse" name="6">
              <template slot="title">
                <span class="collapse-title-left">五官</span>
              </template>
              <table class="table" style="width: 100%">
                <tbody>
                <tr>
                  <th width="30%">项目</th>
                  <th width="30%">结果</th>
                  <th width="40%"></th>
                </tr>
                <tr >
                  <td  style="text-align: center">耳</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.ear">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">鼻</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.nose">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">色觉</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.colorVision">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                </tbody>
              </table>
            </el-collapse-item>
            <el-collapse-item class="collapse" name="7">
              <template slot="title">
                <span class="collapse-title-left">口腔</span>
              </template>
              <table class="table" style="width: 100%">
                <tbody>
                <tr>
                  <th width="30%">项目</th>
                  <th width="30%">结果</th>
                  <th width="40%">单位</th>
                </tr>
                <tr >
                  <td  style="text-align: center">乳活动龋</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="milkActiveCaries" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.milkActiveCaries" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td style="text-align: center">颗</td>
                </tr>
                <tr >
                  <td  style="text-align: center">乳龋齿缺失</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="lactobacillusDecayedTooth" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.lactobacillusDecayedTooth" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td style="text-align: center">颗</td>
                </tr>
                <tr >
                  <td  style="text-align: center">恒活动龋</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="constantActiveCaries" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.constantActiveCaries" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td style="text-align: center">颗</td>
                </tr>
                <tr >
                  <td  style="text-align: center">恒龋齿缺失</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="lossOfConstantCaries" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.lossOfConstantCaries" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td style="text-align: center">颗</td>
                </tr>
                <tr >
                  <td  style="text-align: center">乳龋齿充填</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="milkCariesFilling" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.milkCariesFilling" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td style="text-align: center">颗</td>
                </tr>
                <tr >
                  <td  style="text-align: center">恒龋齿充填</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="constantDentalCariesFilling" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.constantDentalCariesFilling" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td style="text-align: center">颗</td>
                </tr>
                <tr >
                  <td  style="text-align: center">牙周病</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.periodontalDisease">
                        <el-option v-for="item in yMOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr >
                  <td  style="text-align: center">扁桃体</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.tonsil">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td></td>
                </tr>
                </tbody>
              </table>
            </el-collapse-item>
            <el-collapse-item class="collapse" name="8">
              <template slot="title">
                <span class="collapse-title-left">检验</span>
              </template>
              <table class="table" style="width: 100%">
                <tbody>
                <tr>
                  <th width="30%">项目</th>
                  <th width="30%">结果</th>
                  <th width="40%">单位</th>
                </tr>
                <tr >
                  <td  style="text-align: center">血总胆红素</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="tbii" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.tbii" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">μmol</td>
                </tr>
                <tr >
                  <td  style="text-align: center">白细胞</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="hemameba" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.hemameba" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">10^9/L</td>
                </tr>
                <tr >
                  <td  style="text-align: center">丙氨酸氨基转移酶</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="alanineAminotransferase" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.alanineAminotransferase" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">U/L</td>
                </tr>
                <tr >
                  <td  style="text-align: center">血小板</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="platelet" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.platelet" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">10^9/LL</td>
                </tr>
                <tr >
                  <td  style="text-align: center">血红蛋白</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="hemoglobin" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.hemoglobin" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">g/L</td>
                </tr>
                <tr >
                  <td  style="text-align: center">红细胞</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-form-item prop="erythrocyte" label-width="0px" :rules="[{validator: isNumber,trigger: 'blur'}]" :inline-message="true">
                        <el-input class="input-width" v-model="health.erythrocyte" ></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <td  style="text-align: center">10^12/L</td>
                </tr>
                </tbody>
              </table>
            </el-collapse-item>
            <el-collapse-item class="collapse" name="9">
              <template slot="title">
                <span class="collapse-title-left">其它</span>
              </template>
              <table class="table" style="width: 100%">
                <tbody>
                <tr>
                  <th width="30%">项目</th>
                  <th width="30%">结果</th>
                  <th width="40%"></th>
                </tr>
                <tr >
                  <td  style="text-align: center">胸透</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.chestXray">
                        <el-option v-for="item in normalOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td  style="text-align: center"></td>
                </tr>
                <tr v-if="health.sex === '1'">
                  <td  style="text-align: center">男生首次遗精</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.firstSpermatorrhea">
                        <el-option v-for="item in isNotOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td  style="text-align: center"></td>
                </tr>
                <tr v-else>
                  <td  style="text-align: center">女生月经初潮</td>
                  <td  style="text-align: center">
                    <div class="customInput-equipmentForm input-div">
                      <el-select v-model="health.firstMenarche">
                        <el-option v-for="item in isNotOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </td>
                  <td  style="text-align: center"></td>
                </tr>
                </tbody>
              </table>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item size="large" style="text-align: center;" class="form-action">
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" @click="onSubmit('health')" :disabled="submitFlag">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { formatDate, getSchoolYear } from "@/utils/index";

export default {
  name: "HealthForm",
  data() {
    var checkIdentityNo = (rule, value, callback) => {
      if (typeof value !== "string") return callback(new Error("非法身份证"));
      if (value.length === 0) return callback(new Error("身份证号码必填"));
      var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
      };
      var birthday =
        value.substr(6, 4) +
        "/" +
        Number(value.substr(10, 2)) +
        "/" +
        Number(value.substr(12, 2));
      var d = new Date(birthday);
      var newBirthday =
        d.getFullYear() +
        "/" +
        Number(d.getMonth() + 1) +
        "/" +
        Number(d.getDate());
      var currentTime = new Date().getTime();
      var time = d.getTime();
      var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      var arrCh = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
      var sum = 0,
        i,
        residue;
      if (this.health.identityType === 4 && !/^[a-zA-Z][0-9]{9}$/.test(value))
        return callback(new Error("非法台湾身份证"));
      if (
        this.health.identityType === 2 &&
        !/^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}\(([0−9aA][0−9aA])|([0-9aA])\)$/i.test(
          value
        )
      )
        return callback(new Error("非法香港身份证"));
      if (
        this.health.identityType === 3 &&
        !/^[1|5|7][0-9]{6}\([0-9Aa]\)/i.test(value)
      )
        return callback(new Error("非法澳门身份证"));
      if (this.health.identityType === 5 && !/^[a-zA-Z][0-9]{9}$/i.test(value))
        return callback(new Error("非法身份证"));
      if (this.health.identityType === 1) {
        if (!/^\d{17}(\d|x)$/i.test(value))
          return callback(new Error("非法身份证"));
        if (city[value.substr(0, 2)] === undefined)
          return callback(new Error("非法身份证"));
        if (time >= currentTime || birthday !== newBirthday) {
          return callback(new Error("非法身份证"));
        } else {
          for (i = 0; i < 17; i++) {
            sum += value.substr(i, 1) * arrInt[i];
          }
          residue = arrCh[sum % 11];
          if (residue !== value.substr(17, 1))
            return callback(new Error("非法身份证"));
        }
      }
      return callback();
    };
    return {
      pickerDate: {
        disabledDate: time => {
          var date = new Date();
          return time.getTime() > date;
        }
      },
      submitFlag: false,
      normalOptions: [
        {
          value: "1",
          label: "正常"
        },
        {
          value: "0",
          label: "异常"
        }
      ],
      isNotOptions: [
        {
          value: "1",
          label: "是"
        },
        {
          value: "0",
          label: "否"
        }
      ],
      yMOptions: [
        {
          value: "1",
          label: "阴性"
        },
        {
          value: "2",
          label: "阳性"
        }
      ],
      health: {
        id: "",
        userId: "",
        name: "", // 学生姓名
        schoolYear: "",
        birthday: "", // 出生日期
        schoolYearStart: "", // 学年度开始年份
        schoolYearEnd: "", // 学年度结束年份
        classId: "", // 班级Id
        schoolClassName: "", // 班级名
        gradeId: "", // 年级Id
        schoolGradeName: "", // 年级名称
        sex: "1", // 性别 1-男；2-女
        identityType: "", // 身份证类型
        identityNo: "", // 身份证id
        healthExamTime: new Date(), // 体测时间
        height: "",
        weight: "",
        // bodyMassIndex: '',
        quietHeartRate: "",
        systolicPressure: "",
        diastolicBloodPressure: "",
        lungCapacity: "",
        heart: "",
        lung: "",
        liver: "",
        spleen: "",
        head: "",
        neck: "",
        lymphNode: "",
        thyroidGland: "",
        thoracic: "",
        spine: "",
        limbs: "",
        flatFeet: "",
        abdomen: "",
        skin: "",
        mammaryGland: "",
        genital: "",
        leftEyeEyesight: "",
        rightEyeEyesight: "",
        trachoma: "",
        conjunctivitis: "",
        ear: "",
        nose: "",
        colorVision: "",
        milkActiveCaries: "",
        lactobacillusDecayedTooth: "",
        constantActiveCaries: "",
        lossOfConstantCaries: "",
        milkCariesFilling: "",
        constantDentalCariesFilling: "",
        periodontalDisease: "",
        tonsil: "",
        μmol: "",
        hemameba: "",
        alanineAminotransferase: "",
        platelet: "",
        hemoglobin: "",
        erythrocyte: "",
        chestXray: "",
        firstSpermatorrhea: "",
        firstMenarche: ""
      },
      isShowDate: false,
      itemList: [],
      items: [],
      rules: {
        schoolYear: [
          { required: true, message: "请选择学年", trigger: "change" }
        ],
        gradeId: [{ required: true, message: "请选择年级", trigger: "change" }],
        classId: [{ required: true, message: "请选择班级", trigger: "change" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        sex: [{ required: true, message: "请选性别", trigger: "change" }],
        identityType: [
          { required: true, message: "请选择证件类型", trigger: "change" }
        ],
        birthday: [
          { required: true, message: "请选出生日期", trigger: "change" }
        ],
        identityNo: [{ validator: checkIdentityNo, tigger: "blur" }],
        healthExamTime: [
          { required: true, message: "请选择体测时间", trigger: "change" }
        ]
      },
      schoolYearOptions: [],
      gradeOptions: [],
      classOptions: [],
      identityTypeOptions: [
        {
          value: 1,
          label: "中国大陆身份证"
        },
        {
          value: 2,
          label: "中国香港身份证"
        },
        {
          value: 3,
          label: "中国澳门身份证"
        },
        {
          value: 4,
          label: "中国台湾身份证"
        },
        {
          value: 5,
          label: "国外护照"
        }
      ],
      activeArr: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    };
  },
  methods: {
    isNumber(rule, value, callback) {
      if (value) {
        const re = /^(-?\d+)(\.\d+)?$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error("请输入正确信息！"));
        } else {
          const num = parseFloat(value);
          var flag = true;
          switch (rule.field) {
            case "milkActiveCaries":
            case "lactobacillusDecayedTooth":
            case "constantActiveCaries":
            case "lossOfConstantCaries":
            case "milkCariesFilling":
            case "constantDentalCariesFilling":
            case "tbii":
            case "hemameba":
            case "alanine_aminotransferase":
            case "platelet":
            case "hemoglobin":
            case "erythrocyte":
              if (num > 0) {
                flag = true;
              } else {
                flag = false;
              }
              break;
            case "weight":
            case "systolicPressure":
            case "diastolicBloodPressure":
              if (num > 0 && num < 200) {
                flag = true;
              } else {
                flag = false;
              }
              break;
            case "leftEyeEyesight":
            case "rightEyeEyesight":
              if (num > 0 && num <= 5.2) {
                flag = true;
              } else {
                flag = false;
              }
              break;
            case "height":
              if (num > 0 && num < 300) {
                flag = true;
              } else {
                flag = false;
              }
              break;
            case "quietHeartRate":
              if (num > 0 && num < 160) {
                flag = true;
              } else {
                flag = false;
              }
              break;
            case "lungCapacity":
              if (num > 0 && num < 15000) {
                flag = true;
              } else {
                flag = false;
              }
              break;
            default:
              flag = true;
          }
          if (flag) {
            callback();
          } else {
            callback(new Error("请输入正确信息！"));
          }
        }
      } else {
        callback();
      }
    },
    goBack() {
      this.$router.push("healthList");
    },
    schoolYearChange() {
      this.health.classId = "";
      this.getClass();
    },
    // 接口网络请求体测详情
    detailRequest() {
      var id = this.$route.query.id;
      if (typeof id !== "undefined" && id !== "") {
        var healthItem = {
          id: this.$route.query.id,
          type:1
        };
        this.health.id = this.id;
        this.$store
          .dispatch("GetHealthItemDetail", healthItem)
          .then(response => {
            var time = response.data.healthExamTime.replace("T", " ");
            this.health.gradeId = response.data.gradeId;
            this.getClass();
            var _this = this;
            setTimeout(function() {
              var b = formatDate(time, "yyyy-MM-dd");
              _this.health = response.data;
              _this.health.healthExamTime = b;
              _this.health.schoolYear =
                _this.health.schoolYearStart + "-" + _this.health.schoolYearEnd;
              _this.health.sex = _this.health.sex + "";
              _this.health.healthExaminationItemCategoryResponseBeanList.forEach(
                (v, i) => {
                  v.healthExaminationItemResponseBeanList.forEach(
                    (value, index) => {
                      // if (value.value === '0') {
                      //   value.value = ''
                      // }
                      _this.$set(_this.health, value.code, value.value);
                    }
                  );
                }
              );
            }, 500);
          });
      }
    },
    getClass(value) {
      this.health.classId = "";
      var data = {};
      for (let i = 0; i < this.gradeOptions.length; i++) {
        if (this.health.gradeId == this.gradeOptions[i].gradeId) {
          data.schoolTypeGradeId = this.gradeOptions[i].id;
        }
      }
      var list = this.health.schoolYear.split("-");
      if (list.length > 0) {
        data.schoolYearStart = list[0];
        data.schoolYearEnd = list[1];
      }
      this.$store.dispatch("GetClass", data).then(response => {
        this.classOptions = response.data;
      });
      if (value) {
        let obj = {};
        obj = this.gradeOptions.find(item => {
          return item.dictClassId === value;
        });
        this.health.schoolGradeName = obj.gradeName;
      }
    },
    identityTypeChange() {
      if (this.health.identityType !== 1) {
        this.isShowDate = true;
      } else {
        this.isShowDate = false;
      }
    },
    getClassName(value) {
      let obj = {};
      obj = this.classOptions.find(item => {
        return item.dictClassId === value;
      });
      this.health.schoolClassName = obj.dictClassName;
    },
    getGrade() {
      this.$store.dispatch("GetGrade").then(response => {
        this.gradeOptions = response.data;
      });
    },
    checkAndBind: function(event) {
      this.$set(this.health, event.target.id, event.target.value);
    },
    onSubmit(formName) {
      this.submitFlag = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var list = this.health.schoolYear.split("-");
          if (list.length > 0) {
            this.health.schoolYearStart = list[0];
            this.health.schoolYearEnd = list[1];
          }
          var user = JSON.parse(window.localStorage.getItem("ydl_user"));
          this.health.userId = user.userId;
          this.health.healthExamTime = formatDate(
            this.health.healthExamTime,
            "yyyy-MM-dd"
          );
          if(typeof this.health.dictGrade!="undefined" &&this.health.dictGrade){
            this.health.schoolGradeName=this.health.dictGrade;
          }
          this.$store.dispatch("AddHealth", this.health).then(response => {
            this.$alert("保存成功", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.$router.push({
                  name:"HealthList",
                  params:{
                    schoolYear:this.health.schoolYear,
                    type:"update"
                  }
                });
              }
            });
          });
        } else {
          this.$alert("请完成必填/选项!", "提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        }
      });
      this.submitFlag = false;
    }
  },
  mounted: function() {
    this.schoolYearOptions = getSchoolYear();
    // this.health.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value;
    this.health.schoolYear = this.schoolYearOptions[0].value
    this.getGrade();
    this.detailRequest();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.input-width {
  width: 120px;
}
</style>
