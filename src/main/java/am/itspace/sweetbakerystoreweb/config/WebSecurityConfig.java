package am.itspace.sweetbakerystoreweb.config;

import am.itspace.sweetbakerystorecommon.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.thymeleaf.extras.springsecurity4.dialect.SpringSecurityDialect;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .formLogin()
                .loginPage("/login")
                .failureUrl("/login?error=true")
                .defaultSuccessUrl("/login-success")
                .and()
                .logout().logoutSuccessUrl("/")
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                .and()
                .authorizeRequests()
                .antMatchers("/user/**").hasAuthority(Role.USER.name())
                .antMatchers("/addresses", "/products/add/favorite-product", "/add-review",
                        "/payment/card/add", "/checkout").authenticated()
                .antMatchers("/admin/**", "/favorite-products").hasAuthority(Role.ADMIN.name())
                .antMatchers(
                        "/products",
                        "/products-add",
                        "/products-edit",
                        "/favorite-products",
                        "/reviews", "/admin-page")
                .hasAuthority(Role.PARTNER.name())
                .anyRequest()
                .permitAll()
                .and()
                .exceptionHandling().accessDeniedPage("/access-denied");
    }

    @Bean
    public SpringSecurityDialect securityDialect() {
        return new SpringSecurityDialect();
    }
}

