package site.controllers;

import org.ehcache.Cache;
import org.springframework.cache.Cache.ValueWrapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.cache.CacheManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@PreAuthorize("hasRole('USER')")
public class CacheMonitorController {

    private final org.springframework.cache.CacheManager springCacheManager;

    public CacheMonitorController(org.springframework.cache.CacheManager springCacheManager) {
        this.springCacheManager = springCacheManager;
    }

    @GetMapping("/cache-entries")
    public Map<String, Object> getCacheEntries() {
	// Obtém o cache "downloadFile" via Spring Cache
        org.springframework.cache.Cache springCache = springCacheManager.getCache("downloadFile");
        if (springCache == null) {
            return Map.of("error", "Cache 'downloadFile' não encontrado");
        }

        // Obtém o cache nativo como javax.cache.Cache
        Object nativeCache = springCache.getNativeCache();
        if (!(nativeCache instanceof javax.cache.Cache)) {
            return Map.of("error", "Cache nativo não é uma instância de javax.cache.Cache");
        }
        
        javax.cache.Cache<String, byte[]> jcache = (javax.cache.Cache<String, byte[]>) nativeCache;
        // Usa unwrap para obter o cache nativo do Ehcache
        org.ehcache.Cache<String, byte[]> ehcache = jcache.unwrap(org.ehcache.Cache.class);

        Map<String, Object> entries = new HashMap<>();
        // Itera sobre as entradas do cache
        for (org.ehcache.Cache.Entry<String, byte[]> entry : ehcache) {
            // Converte o array de bytes para String para visualização (ajuste conforme necessário)
            String value = new String(entry.getValue());
            if (value.length() > 50) {
        	value = value.substring(0, 50) + "...";
            } 
            entries.put(entry.getKey(), value);
        }
        return entries;
    }
}
