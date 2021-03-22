import java.util.Scanner;
import java.util.ArrayList;
import java.io.*;

public class UserCode {
    public static void main(String[] args) throws FileNotFoundException{
        Scanner sc = new Scanner(new File("pr53.dat")); 
        int n = sc.nextInt();
        sc.nextLine();
        while(sc.hasNextLine()){
            userPrint(sc.nextLine());
        }
    }
    public static void userPrint(String line){
        String[] words = line.split(" ");
        ArrayList<String> notFours = new ArrayList<String>();
        ArrayList<String> fours = new ArrayList<String>();
        for(String word: words){
            if(word.length() == 4){
                fours.add(word);
            }
            else notFours.add(word);
        }
        String output = "";
        for(String word: notFours){
            output += word + " ";
        }
        output.trim();
        String out = "";
        for(String word: fours){
            out += word + "\n";
        }
        System.out.println(output);
        System.out.println(out);
    }
}