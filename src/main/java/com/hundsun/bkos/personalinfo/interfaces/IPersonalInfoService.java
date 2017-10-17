package com.hundsun.bkos.personalinfo.interfaces;

import javax.validation.groups.Default;

import com.hundsun.bkos.base.ReturnDTO;
import com.hundsun.bkos.common.query.AdjunctQuery;
import com.hundsun.bkos.permission.annotation.Validate;
import com.hundsun.bkos.permission.validation.ValidGroupA;
import com.hundsun.jresplus.remoting.impl.annotation.Service;
import com.hundsun.jresplus.remoting.impl.annotation.ServiceModule;

@ServiceModule
public interface IPersonalInfoService {
    /**
     * 公众号上传附件
     * 
     * @param
     * @return
     */
    @Service(functionId = "99313")
    @Validate({ValidGroupA.class, Default.class})
    public ReturnDTO dealOfficialAdjunct(AdjunctQuery query);





}
