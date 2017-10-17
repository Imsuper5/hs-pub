package com.hundsun.bkos.official.utils;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.common.utils.PropsUtils;
import com.hundsun.bkos.common.util.KeyGenerater;
import com.hundsun.bkos.official.controller.OfficialSendAction;
import com.hundsun.bkos.util.SignRSAUtils;

public class OkHttpUtils {
	 	private static final byte[] LOCKER = new byte[0];  
		private static OkHttpClient mOkHttpClient;  
		public static final MediaType myJSON = MediaType.parse("application/json; charset=utf-8");
		
		private static String priKey = KeyGenerater.getPriKey();
		
		private static String url_suffix = "http://" + PropsUtils.get("fs.server.host") + ":" + PropsUtils.get("fs.server.port") + "/"
				+ PropsUtils.get("fs.server.path");
		
		private static final Logger logger = LoggerFactory.getLogger(OfficialSendAction.class);
		
	    private static void  CreateOkHttpUtils() {  
	        okhttp3.OkHttpClient.Builder ClientBuilder=new okhttp3.OkHttpClient.Builder();  
	        ClientBuilder.readTimeout(30, TimeUnit.SECONDS);//读取超时  
	        ClientBuilder.connectTimeout(10, TimeUnit.SECONDS);//连接超时  
	        ClientBuilder.writeTimeout(60, TimeUnit.SECONDS);//写入超时  
	        mOkHttpClient = ClientBuilder.build(); 
	    }  
	  
	    public static OkHttpClient getInstance() {  
	        if (mOkHttpClient == null) {  
	            synchronized (LOCKER) {  
	                if (mOkHttpClient == null) {  
	                	CreateOkHttpUtils();
	                }  
	            }  
	        }  
	        return mOkHttpClient;  
	    }
	    
	    /**
		 * 文件上传服务令牌获取
		 * @return String
		 */
		public static String fileServesAuth(String userNo){
			OkHttpClient okHttpClient = OkHttpUtils.getInstance();
			String auth = "";
			Response okHttpResponse = null;
			String url =  url_suffix + PropsUtils.get("fs.client.auth.path");
			try {
				byte[] b = SignRSAUtils.sign(priKey.getBytes(), userNo);
				String signText = new String(b).trim();
				RequestBody body = RequestBody.create(myJSON, "");
				signText = URLEncoder.encode(signText, "utf-8");
				Request requestBuilder = new Request.Builder().url(url+"?signText="+signText)
						.addHeader("AuthType", "U")
						.addHeader("UserNo", userNo)
						.addHeader("ResourceUrl", "url")
						.addHeader("Policy", "policy")
						.addHeader("signText", signText)
						.post(body)
						.build();
				okHttpResponse = okHttpClient.newCall(requestBuilder).execute();
				if (okHttpResponse.isSuccessful()) {
					Map<String, Object> res = JSON.parseObject(okHttpResponse.body().string(),
							new TypeReference<Map<String, Object>>() {
							});
					auth = (String) res.get("Auth");
					return auth;
				}
			} catch (IOException e) {
				logger.error("File Upload Error ! ", e.getMessage());
			}
			return "";
		}
		
		/**
		 * 图片文件上传
		 * @return String
		 */
		public static String multiPartFormDataUpload(MultipartFile file,String auth){
			OkHttpClient okHttpClient = OkHttpUtils.getInstance();
			RequestBody requestBody = null;
			String uuid = "";
			Response okHttpResponse = null;
			MediaType mediaType = MediaType.parse("application/octet-stream; charset=utf-8");
			String url = url_suffix + PropsUtils.get("fs.client.upload.path");
			try {
				requestBody = RequestBody.create(mediaType, file.getBytes());
				MultipartBody.Builder multiPartBody = new MultipartBody.Builder();
				multiPartBody.addFormDataPart("file", URLEncoder.encode(file.getOriginalFilename(),"utf-8"), requestBody);
				multiPartBody.setType(MediaType.parse("multipart/form-data"));
				RequestBody body = multiPartBody.build();
				Request.Builder requestBuilder = new Request.Builder().url(url)
						.addHeader("SelfClient", URLEncoder.encode(file.getOriginalFilename(),"utf-8"))
						.addHeader("policy", "policy")
						.addHeader("auth", auth)
						.addHeader("deadline", String.valueOf(System.currentTimeMillis()))
						.post(body);
				okHttpResponse = okHttpClient.newCall(requestBuilder.build()).execute();
				if (okHttpResponse.isSuccessful()) {
					Map<String, Object> res = JSON.parseObject(okHttpResponse.body().string(),
							new TypeReference<Map<String, Object>>() {
							});
					uuid = (String) res.get("Key");
					return uuid;
				}
			} catch (IOException e) {
				logger.error("File Upload Error ! ", e.getMessage());
			}
			return "";
		}
		
		/**
		 * 图片文件下载
		 * @return byte[]
		 */
		public  static byte[] multiPartFormDataDown(String resid){
			OkHttpClient okHttpClient = OkHttpUtils.getInstance();
			Response okHttpResponse = null;
			String url = url_suffix + PropsUtils.get("fs.client.down.path");
			try {
				RequestBody body = RequestBody.create(myJSON, "");
				Request requestBuilder = new Request.Builder().url(url)
						.addHeader("resid", resid)
						.post(body)
						.build();
				okHttpResponse = okHttpClient.newCall(requestBuilder).execute();
				if (okHttpResponse.isSuccessful()) {
					return okHttpResponse.body().bytes();
				}
			} catch (IOException e) {
				logger.error("File Down Error ! ", e.getMessage());
			}
			return null;
		}
		
		
		/**
		 * 获取文件下载路径
		 * @return String
		 */
		public static String getFileDownPath(){
			return url_suffix + PropsUtils.get("fs.client.down.path");
		}
		
}
