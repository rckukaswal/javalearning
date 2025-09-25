package selfpractice;

public class S3 {

	public static void main(String[] args) {

		int science = 75;
		int english = 25;
		int hindi = 00;
		float mathematics = 7.5f;

		/*
		 * int a = 75; int b = 25; int c = 00; float d = 7.5f;
		 * 
		 */

		float a = science;
		float b = english;
		float c = hindi;
		float d = mathematics;

		float AVG = (a + b + c + d) / 4;

		System.out.println(AVG);

		if (AVG / 4 >= 90) {
			System.out.println("Grage A");

		} else if (AVG / 4 >= 75) {
			System.out.println("Grage B");

		} else if (AVG / 4 >= 50) {
			System.out.println("Grage C");

		} else if (AVG / 4 >= 35) {
			System.out.println("Grage D");

		} else {
			System.out.println("Fail");
		}

	}

}
