package site.controlleradvice;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalModelAttributes {

    @Value("${global.version}")
    private String numeroGlobal;
    

    @ModelAttribute("version")
    public String getNumeroGlobal() {
        return this.numeroGlobal;
    }

}
