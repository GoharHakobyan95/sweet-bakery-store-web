package am.itspace.sweetbakerystoreweb.storage;

import am.itspace.sweetbakerystorecommon.dto.basketDto.BasketDto;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.annotation.SessionScope;


@Configuration
public class BeanCreator {

    @Bean
    @SessionScope
    public BasketDto basketDto() {
        return new BasketDto();
    }
}
