package site.config;


import org.ehcache.jsr107.EhcacheCachingProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.jcache.JCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.cache.Caching;
import javax.cache.spi.CachingProvider;
import java.net.URI;

@Configuration
@EnableCaching
public class EhCacheConfig {
    
    @Value("${spring.cache.jcache.config}")
    private String cacheConfigUri;

    @Bean
    public CacheManager cacheManager() throws Exception {
        CachingProvider provider = Caching.getCachingProvider(EhcacheCachingProvider.class.getName());
        // Carrega o arquivo de configuração como URI
        URI uri = getClass().getResource(cacheConfigUri).toURI();
        // Utiliza o overload getCacheManager(URI, ClassLoader)
        javax.cache.CacheManager jCacheManager = provider.getCacheManager(uri, getClass().getClassLoader());
        return new JCacheCacheManager(jCacheManager);
    }
}


