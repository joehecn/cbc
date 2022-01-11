import OSS from 'ali-oss';

// 用户登录名称 yuehwa@1169367905365878.onaliyun.com
// AccessKey ID LTAI5tSYgFt41JarhKc8sBod
// AccessKey Secret yy1co7WvNWktmOGx02jr3uG0inkqTO
const client = new OSS({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'oss-cn-hongkong',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'LTAI5tSYgFt41JarhKc8sBod',
  accessKeySecret: 'yy1co7WvNWktmOGx02jr3uG0inkqTO',
  bucket: 'cbosv3'
});

export async function putJSON(json: any, name: string) {
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });

  // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
  // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
  const filename = `ota/${name}.json`;
  const res = await client.put(filename, blob);

  return res?.res?.status === 200;
}

export const getJSON = async (name: string) => {
  const url = `https://cbosv3.oss-cn-hongkong.aliyuncs.com/ota/${name}.json?t=${Date.now()}`;
  const res = await fetch(url);

  return res?.json();
};
