package site.model;

import java.util.List;

import lombok.Data;

@Data
public class PostPageDTO {

    private String title;
    private String dir;
    private String content;
    private String description;
    private String image;
    private List<String> imagePages;
}
