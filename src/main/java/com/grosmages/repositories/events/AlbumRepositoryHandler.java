package com.grosmages.repositories.events;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

@Aspect
@Configuration
public class AlbumRepositoryHandler {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @AfterReturning(pointcut = "execution(* com.grosmages.repositories.AlbumRepository.save(..))", returning = "result")
    public void afterAlbumSaved(JoinPoint joinPoint, Object result)  {
        logger.info("After album saved");
    }
}
