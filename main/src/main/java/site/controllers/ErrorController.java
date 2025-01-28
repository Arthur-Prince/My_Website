package site.controllers;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.WebRequest;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public class ErrorController {

    private final ErrorAttributes errorAttributes;

    public ErrorController(ErrorAttributes errorAttributes) {
        this.errorAttributes = errorAttributes;
    }

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        // Obtém os detalhes do erro

        Map<String, Object> errorDetails = errorAttributes.getErrorAttributes((WebRequest) request, ErrorAttributeOptions.defaults());

        // Adiciona os detalhes à model para usar no Thymeleaf
        model.addAttribute("status", errorDetails.get("status"));
        model.addAttribute("error", errorDetails.get("error"));
        model.addAttribute("message", errorDetails.getOrDefault("message", "Algo deu errado."));

        return "error"; // Retorna a página única de erro
    }
}
