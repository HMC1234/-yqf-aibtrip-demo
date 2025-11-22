# 根据详细文档修复API调用

## 修复内容

根据 `广州中航服机票文档 v1.2.pdf.docx` 的详细说明，修复了以下问题：

### 1. version参数修复

**问题：** 之前将version参数作为可选参数处理，但根据文档，version是**必填参数**，且必须填写`2.0`。

**修复：**
- `src/lib/yqf-air/config.ts`: 默认version改为`2.0`
- `src/lib/yqf-air/client.ts`: version参数改为必填，默认值为`2.0`
- `src/pages/Test/YQFAPITest.tsx`: 配置表单中version字段改为必填，默认值`2.0`

### 2. OfficeIds参数添加

**问题：** 根据文档，`OfficeIds`（注册公司）是**必填参数**，但之前代码中完全没有传递这个参数。

**修复：**
- `src/lib/yqf-air/types.ts`: 在`FlightSearchParams`接口中添加`OfficeIds: string[]`必填字段
- `src/pages/Test/YQFAPITest.tsx`: 
  - 在配置表单中添加`OfficeIds`字段（默认值：`EI00D`）
  - 在航班查询表单中添加`OfficeIds`字段（必填）
  - 在构建查询参数时添加`OfficeIds`处理逻辑（支持逗号分隔的多个公司）

### 3. 参数顺序调整

根据文档示例，调整了请求参数的顺序，将必填参数放在前面：
- `OfficeIds`（必填）
- `Type`（必填）

## 文档关键信息

### 系统级参数（URL查询字符串）

| 参数名  | 类型   | 必填 | 说明                                  |
|---------|--------|------|---------------------------------------|
| version | string | 是   | API版本号，当前固定填写2.0            |
| app_key | string | 是   | 应用标识（AppKey），在应用列表中获取  |
| method  | string | 是   | 要调用的API接口名称                    |

### 应用级参数（HTTP Body，需加密）

#### EasyShopping_V2（机票查询）必填参数

| 参数名     | 类型          | 必须 | 说明           |
|------------|---------------|------|----------------|
| Routings   | List<Routing> | 是   | 查询行程路线   |
| OfficeIds  | List<String>  | 是   | 注册公司       |
| Type       | String        | 是   | 机票类型（A/D）|

#### 请求参数示例

```json
{
  "Passengers": [{"PassengerType": "ADT"}],
  "Routings": [
    {
      "Departure": "CAN",
      "Arrival": "SIN",
      "ArrivalType": 1,
      "DepartureDate": "2023-03-27",
      "DepartureType": 1
    }
  ],
  "Type": "A",
  "OfficeIds": ["EI00D"],
  "BerthType": "Y",
  "OnlyDirectFlight": false,
  "IsQueryRule": false,
  "IsQueryAirline": false,
  "CodeShare": false,
  "IsQueryAirport": false
}
```

## 修改的文件

1. `src/lib/yqf-air/config.ts` - version默认值改为2.0
2. `src/lib/yqf-air/client.ts` - version参数改为必填
3. `src/lib/yqf-air/types.ts` - 添加OfficeIds必填字段
4. `src/pages/Test/YQFAPITest.tsx` - 添加OfficeIds配置和查询字段

## 测试建议

1. 在测试页面的"配置"标签页中：
   - 确认`API Version`字段显示为`2.0`（必填）
   - 填写`注册公司（OfficeIds）`字段，例如：`EI00D`

2. 在"航班查询"标签页中：
   - 确认`注册公司（OfficeIds）`字段已显示（必填）
   - 填写正确的注册公司代码

3. 测试API调用：
   - 检查请求URL中是否包含`version=2.0`
   - 检查请求Body中是否包含`OfficeIds`字段

## 注意事项

1. **version参数**：必须填写`2.0`，不能为空或省略
2. **OfficeIds参数**：是必填参数，至少需要一个注册公司代码
3. **多个公司**：如果有多家公司，可以用逗号分隔，如：`EI00D,ABC123`
4. **默认值**：代码中设置了默认值`EI00D`，但实际使用时应该使用真实的注册公司代码

