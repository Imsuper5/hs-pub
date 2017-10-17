package com.hundsun.bkos.official.interfaces;

import java.util.List;

import com.hundsun.bkos.base.ReturnDTO;
import com.hundsun.bkos.common.dto.OfficialAccountDTO;
import com.hundsun.bkos.common.query.OfficialParamQuery;
import com.hundsun.bkos.official.dto.OfficialAccountMsgDTO;
import com.hundsun.bkos.official.dto.page.OfficialAccountMsgPageDTO;
import com.hundsun.bkos.official.query.OfficialAccountMsgQuery;
import com.hundsun.bkos.official.query.PubLoginQuery;
import com.hundsun.bkos.permission.annotation.Validate;
import com.hundsun.bkos.permission.validation.ValidGroupB;
import com.hundsun.bkos.permission.validation.ValidGroupC;
import com.hundsun.jresplus.remoting.impl.annotation.Service;
import com.hundsun.jresplus.remoting.impl.annotation.ServiceModule;

@ServiceModule
public interface IOfficialService {
    /**
     * 公众号登陆
     * 
     * @param 登陆
     * @return 登陆
     */
    @Service(functionId = "99713")
    @Validate
    public OfficialAccountDTO loginPubCheck(PubLoginQuery query);

  

    /**
     * 公众号密码修改
     * 
     * @param 密码修改
     * @return 密码修改
     */
    @Service(functionId = "99712")
    @Validate({ValidGroupB.class, ValidGroupC.class})
    public ReturnDTO updateOfficialPwd(OfficialParamQuery query);

    /**
     * 公众号消息查询
     * 
     * @param 查询
     * @return 查询
     */
    @Service(functionId = "99318")
    public OfficialAccountMsgPageDTO getOfficialMsgList(OfficialAccountMsgQuery query);

    /**
     * 公众号消息新增
     * 
     * @param 新增
     * @return 新增
     */
    @Service(functionId = "99315")
    public OfficialAccountMsgDTO addOfficialMsg(OfficialAccountMsgQuery query);

    /**
     * 公众号消息新增
     * 
     * @param 新增
     * @return 新增
     */
    @Service(functionId = "99316")
    public OfficialAccountMsgDTO updateOfficialMsg(OfficialAccountMsgQuery query);

    /**
     * 公众号消息新增
     * 
     * @param 新增
     * @return 新增
     */
    @Service(functionId = "99317")
    public ReturnDTO updateOfficialMsgStatus(OfficialAccountMsgQuery query);

    /**
     * 公众号图片查询
     * 
     * @param 查询
     * @return 查询
     */
    @Service(functionId = "99319")
    public List<OfficialAccountMsgDTO> getOfficialMsgImg(OfficialAccountMsgQuery query);

    /**
     * 公众号消息体查询
     * 
     * @param 查询
     * @return 查询
     */
    @Service(functionId = "99327")
    public List<OfficialAccountMsgDTO> getOfficialMsgBody(OfficialAccountMsgQuery query);

    

    /**
     * 公众号消息删除
     * 
     * @param 消息删除
     * @return 消息删除
     */
    @Service(functionId = "99322")
    public ReturnDTO delOfficialMsg(OfficialAccountMsgQuery query);



}
