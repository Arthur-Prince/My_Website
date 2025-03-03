package site.model;

import java.util.List;

import lombok.Data;

@Data
public class LinkDTO {

    private String title;
    private String dir;
    private String description;
    private String image;
    private String link;
    private List<String> deleteList;
}
