package app.stats;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="stats")
public class Stats {

    public Stats(){}

    public Stats(long id, float weight, Date date, String note) {
        super();
        this.id = id;
        this.year = weight;
        this.week = date;
        this.averageWeight = note;
    }

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="\"id\"",unique=true,nullable=false)
    private long id;

    private float averageWeight;
    private int year;
    private int week;


}
